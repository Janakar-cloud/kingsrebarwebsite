// Shared by the browser form and the server route. Keep this file free of
// imports so it can run directly under `node --experimental-strip-types` in tests.

export type EnquiryField = "name" | "email" | "company" | "phone" | "topic" | "message";

export type EnquiryValues = Record<EnquiryField, string>;

export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const emptyEnquiry: EnquiryValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  topic: "",
  message: "",
};

export const limits = {
  name: 100,
  email: 254,
  company: 150,
  phone: 40,
  messageMin: 10,
  message: 5000,
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9 ()\-.]{6,}$/;

export function validateField(
  field: EnquiryField,
  rawValue: string,
  topics: readonly string[],
): string | undefined {
  const value = rawValue.trim();
  switch (field) {
    case "name":
      if (!value) return "Enter your name.";
      if (value.length > limits.name) return `Name must be ${limits.name} characters or fewer.`;
      return undefined;
    case "email":
      if (!value) return "Enter your business email address.";
      if (value.length > limits.email || !emailPattern.test(value))
        return "Enter an email address in the format name@example.com.";
      return undefined;
    case "company":
      if (value.length > limits.company)
        return `Company name must be ${limits.company} characters or fewer.`;
      return undefined;
    case "phone":
      if (!value) return undefined;
      if (value.length > limits.phone || !phonePattern.test(value))
        return "Enter a phone number using digits, spaces and an optional leading +.";
      return undefined;
    case "topic":
      if (!value) return "Choose an enquiry topic.";
      if (!topics.includes(value)) return "Choose an enquiry topic from the list.";
      return undefined;
    case "message":
      if (!value) return "Enter your message.";
      if (value.length < limits.messageMin)
        return `Your message must be at least ${limits.messageMin} characters.`;
      if (value.length > limits.message)
        return `Your message must be ${limits.message} characters or fewer.`;
      return undefined;
  }
}

export const fieldOrder: EnquiryField[] = ["name", "email", "company", "phone", "topic", "message"];

export function validateEnquiry(values: EnquiryValues, topics: readonly string[]): EnquiryErrors {
  const errors: EnquiryErrors = {};
  for (const field of fieldOrder) {
    const error = validateField(field, values[field], topics);
    if (error) errors[field] = error;
  }
  return errors;
}

/** Coerces untrusted input into trimmed strings, dropping unknown keys. */
export function normaliseEnquiry(input: unknown): EnquiryValues {
  const source = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const values = { ...emptyEnquiry };
  for (const field of fieldOrder) {
    const raw = source[field];
    values[field] = typeof raw === "string" ? raw.trim() : "";
  }
  return values;
}

/** Name of the hidden anti-spam field. Real visitors never see or fill it. */
export const honeypotField = "kr_contact_preference";

export type EnquiryResponse =
  | { status: "sent"; simulated?: boolean }
  | { status: "not-sent-development" }
  | { status: "invalid"; errors: EnquiryErrors }
  | { status: "unavailable" }
  | { status: "failed" };
