import { siteUrl } from "@/config/env";
import { site } from "@/content/site";
import { isApproved, type PostalAddress } from "@/content/types";
import { JsonLd } from "./JsonLd";

/**
 * schema.org Organization markup built only from confirmed facts. Optional
 * properties appear automatically once the matching content is approved.
 */
export function OrganizationJsonLd() {
  if (!siteUrl) return null;

  const { contact, assets } = site;
  const address: PostalAddress | null = isApproved(contact.address) ? contact.address : null;
  const hasStructuredAddress = Boolean(address?.addressLocality && address.addressCountry);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.companyName,
    url: siteUrl.href,
  };
  if (isApproved(assets.logo)) data.logo = new URL(assets.logo.src, siteUrl).href;
  if (isApproved(contact.email)) data.email = contact.email;
  if (isApproved(contact.phone)) data.telephone = contact.phone;
  if (address && hasStructuredAddress) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    };
  }
  if (site.social.length > 0) data.sameAs = site.social.map((profile) => profile.url);

  return <JsonLd data={data} />;
}
