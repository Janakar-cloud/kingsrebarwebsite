"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  emptyEnquiry,
  fieldOrder,
  honeypotField,
  limits,
  validateEnquiry,
  validateField,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryResponse,
  type EnquiryValues,
} from "./validation";
import styles from "./EnquiryForm.module.css";

type Status = "idle" | "submitting" | "sent" | "not-sent-development" | "failed";

type Props = {
  topics: readonly string[];
  /** Pre-selects an enquiry type when the form is opened from another page. */
  initialTopic?: string;
  /** Approved privacy notice text, or null when still pending. */
  privacyNotice: string | null;
  /** Shown in place of the privacy notice in preview builds while it is pending. */
  privacyPendingNote: string | null;
  successHeading: string;
  successMessage: string;
  failureMessage: string;
  fallbackContact: { email?: string; phone?: string };
};

const labels: Record<EnquiryField, string> = {
  name: "Name",
  email: "Business email",
  company: "Company",
  phone: "Phone",
  topic: "Enquiry type",
  message: "Message",
};

const requiredFields: ReadonlySet<EnquiryField> = new Set(["name", "email", "topic", "message"]);

const fieldId = (field: EnquiryField) => `enquiry-${field}`;

export function EnquiryForm(props: Props) {
  const { topics, initialTopic } = props;
  const [values, setValues] = useState<EnquiryValues>(() => ({
    ...emptyEnquiry,
    topic: initialTopic && topics.includes(initialTopic) ? initialTopic : "",
  }));
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [simulated, setSimulated] = useState(false);

  const summaryRef = useRef<HTMLDivElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const errorList = fieldOrder.filter((field) => errors[field]);

  function updateError(field: EnquiryField, value: string) {
    setErrors((current) => ({ ...current, [field]: validateField(field, value, topics) }));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = event.target.name as EnquiryField;
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field] || submitAttempted) updateError(field, value);
  }

  function handleBlur(field: EnquiryField) {
    if (values[field].trim() || submitAttempted) updateError(field, values[field]);
  }

  function focusField(field: EnquiryField) {
    document.getElementById(fieldId(field))?.focus();
  }

  function showErrors(nextErrors: EnquiryErrors) {
    flushSync(() => {
      setErrors(nextErrors);
      setShowSummary(true);
      setStatus("idle");
    });
    summaryRef.current?.focus();
  }

  function showOutcome(next: Status) {
    flushSync(() => setStatus(next));
    if (next === "sent") successRef.current?.focus();
    else outcomeRef.current?.focus();
  }

  function startAnother() {
    flushSync(() => setStatus("idle"));
    focusField("name");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setSubmitAttempted(true);
    const nextErrors = validateEnquiry(values, topics);
    if (Object.keys(nextErrors).length > 0) {
      showErrors(nextErrors);
      return;
    }

    setErrors({});
    setShowSummary(false);
    setStatus("submitting");

    const honeypot = new FormData(event.currentTarget).get(honeypotField);

    let result: EnquiryResponse | null = null;
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [honeypotField]: typeof honeypot === "string" ? honeypot : "" }),
      });
      result = (await response.json()) as EnquiryResponse;
    } catch {
      result = null;
    }

    if (result?.status === "sent") {
      setSimulated(Boolean(result.simulated));
      setValues(emptyEnquiry);
      setSubmitAttempted(false);
      showOutcome("sent");
    } else if (result?.status === "not-sent-development") {
      showOutcome("not-sent-development");
    } else if (result?.status === "invalid") {
      showErrors(result.errors);
    } else {
      showOutcome("failed");
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon} aria-hidden="true">
          <Icon name="check" />
        </span>
        <h3 ref={successRef} tabIndex={-1} className={styles.successHeading}>
          {props.successHeading}
        </h3>
        <p>{props.successMessage}</p>
        {simulated && (
          <p className="pending">
            <span className="pending__label">Development</span>
            Simulated success (ENQUIRY_DEV_SIMULATE=success). Nothing was sent.
          </p>
        )}
        <Button variant="secondary" onClick={startAnother}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const submitting = status === "submitting";
  const { fallbackContact } = props;

  function describe(field: EnquiryField, hint?: boolean) {
    const ids = [hint && `${fieldId(field)}-hint`, errors[field] && `${fieldId(field)}-error`];
    return ids.filter(Boolean).join(" ") || undefined;
  }

  function requirement(field: EnquiryField) {
    return <span className={styles.requirement}>{requiredFields.has(field) ? " (required)" : " (optional)"}</span>;
  }

  function errorText(field: EnquiryField) {
    if (!errors[field]) return null;
    return (
      <p id={`${fieldId(field)}-error`} className={styles.error}>
        <Icon name="alert" className={styles.errorIcon} />
        <span className="visually-hidden">Error: </span>
        {errors[field]}
      </p>
    );
  }

  function renderField(field: EnquiryField, control: (describedBy: string | undefined) => ReactNode, hint?: ReactNode) {
    return (
      <div className={styles.field} data-invalid={Boolean(errors[field])}>
        <label htmlFor={fieldId(field)} className={styles.label}>
          {labels[field]}
          {requirement(field)}
        </label>
        {hint && (
          <p id={`${fieldId(field)}-hint`} className={styles.hint}>
            {hint}
          </p>
        )}
        {errorText(field)}
        {control(describe(field, Boolean(hint)))}
      </div>
    );
  }

  const common = (field: EnquiryField, describedBy: string | undefined) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    onChange: handleChange,
    onBlur: () => handleBlur(field),
    required: requiredFields.has(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": describedBy,
    className: styles.control,
  });

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit} aria-describedby="enquiry-required-note">
      {showSummary && errorList.length > 0 && (
        <div
          ref={summaryRef}
          className={styles.summary}
          tabIndex={-1}
          role="alert"
          aria-labelledby="enquiry-summary-title"
        >
          <h3 id="enquiry-summary-title" className={styles.noticeHeading}>
            There is a problem with your enquiry
          </h3>
          <ul>
            {errorList.map((field) => (
              <li key={field}>
                <a
                  href={`#${fieldId(field)}`}
                  onClick={(event) => {
                    event.preventDefault();
                    focusField(field);
                  }}
                >
                  {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === "not-sent-development" && (
        <div ref={outcomeRef} tabIndex={-1} className="pending" role="status">
          <span className="pending__label">Development only</span>
          Your enquiry passed validation but was <strong>not sent</strong>: no delivery destination is configured
          (set ENQUIRY_WEBHOOK_URL). Nothing was stored.
        </div>
      )}

      {status === "failed" && (
        <div ref={outcomeRef} tabIndex={-1} className={styles.failure} role="alert">
          <h3 className={styles.noticeHeading}>Your enquiry was not sent</h3>
          <p>{props.failureMessage}</p>
          {(fallbackContact.email || fallbackContact.phone) && (
            <p>
              You can also contact us
              {fallbackContact.email && (
                <>
                  {" "}
                  by email at <a href={`mailto:${fallbackContact.email}`}>{fallbackContact.email}</a>
                </>
              )}
              {fallbackContact.email && fallbackContact.phone && " or"}
              {fallbackContact.phone && <> by phone on {fallbackContact.phone}</>}.
            </p>
          )}
        </div>
      )}

      <p id="enquiry-required-note" className={styles.hint}>
        Fields marked (required) must be completed.
      </p>

      <div className={styles.row}>
        {renderField("name", (d) => (
          <input type="text" autoComplete="name" maxLength={limits.name} {...common("name", d)} />
        ))}
        {renderField("email", (d) => (
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            maxLength={limits.email}
            {...common("email", d)}
          />
        ))}
      </div>
      <div className={styles.row}>
        {renderField("company", (d) => (
          <input type="text" autoComplete="organization" maxLength={limits.company} {...common("company", d)} />
        ))}
        {renderField("phone", (d) => (
          <input type="tel" autoComplete="tel" maxLength={limits.phone} {...common("phone", d)} />
        ))}
      </div>

      <fieldset
        className={`${styles.field} ${styles.fieldset}`}
        data-invalid={Boolean(errors.topic)}
        aria-describedby={describe("topic")}
      >
        <legend className={styles.label}>
          {labels.topic}
          {requirement("topic")}
        </legend>
        {errorText("topic")}
        <div className={styles.chips}>
          {topics.map((topic, index) => (
            <label key={topic} className={styles.chip}>
              <input
                type="radio"
                id={index === 0 ? fieldId("topic") : undefined}
                name="topic"
                value={topic}
                checked={values.topic === topic}
                onChange={handleChange}
                onBlur={() => handleBlur("topic")}
                required
                className={styles.chipInput}
              />
              <span className={styles.chipLabel}>{topic}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {renderField(
        "message",
        (d) => <textarea rows={7} maxLength={limits.message} {...common("message", d)} />,
        <>
          Between {limits.messageMin} and {limits.message} characters.{" "}
          <span className={styles.count} aria-hidden="true">
            {values.message.length} / {limits.message}
          </span>
        </>,
      )}

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={honeypotField}>Leave this field empty</label>
        <input id={honeypotField} name={honeypotField} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className={styles.privacy}>
        <h3 className={styles.privacyHeading}>How we use your information</h3>
        {props.privacyNotice ? (
          <p>{props.privacyNotice}</p>
        ) : (
          props.privacyPendingNote && (
            <p className="pending">
              <span className="pending__label">Content needed</span>
              {props.privacyPendingNote}
            </p>
          )
        )}
      </div>

      <div className={styles.actions}>
        <Button type="submit" size="lg" arrow={!submitting} aria-disabled={submitting || undefined}>
          {submitting && <span className={styles.spinner} aria-hidden="true" />}
          {submitting ? "Sending…" : "Send enquiry"}
        </Button>
        <p role="status" className={styles.statusText}>
          {submitting ? "Sending your enquiry, please wait." : ""}
        </p>
      </div>
    </form>
  );
}
