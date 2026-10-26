"use client";

import { useSearchParams } from "next/navigation";

import { EnquiryForm } from "./EnquiryForm";

type Props = Omit<Parameters<typeof EnquiryForm>[0], "initialTopic">;

/** Reads `?topic=` on the client so the Contact page can stay static. */
export function EnquiryFormLoader(props: Props) {
  const requested = useSearchParams().get("topic") ?? "";
  const initialTopic = props.topics.includes(requested) ? requested : undefined;
  return <EnquiryForm {...props} initialTopic={initialTopic} />;
}
