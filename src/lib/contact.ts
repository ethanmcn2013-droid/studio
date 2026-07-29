export const CONTACT_EMAILS = {
  general: "hello@signalstudio.ie",
  support: "support@signalstudio.ie",
  billing: "billing@signalstudio.ie",
  privacy: "privacy@signalstudio.ie",
  security: "security@signalstudio.ie",
  partnerships: "partnerships@signalstudio.ie",
} as const;

export type ContactEmailKind = keyof typeof CONTACT_EMAILS;

export const CONTACT_SUBJECTS = {
  general: "Signal Studio enquiry",
  support: "Signal Studio support request",
  billing: "Signal Studio billing enquiry",
  privacy: "Signal Studio privacy request",
  security: "Signal Studio security report",
  partnerships: "Signal Studio partnership enquiry",
} as const satisfies Record<ContactEmailKind, string>;

export function buildMailtoHref(
  kind: ContactEmailKind,
  options: {
    subject?: string;
    body?: string;
  } = {},
): string {
  const address = CONTACT_EMAILS[kind];
  const params = new URLSearchParams();

  if (options.subject) params.set("subject", options.subject);
  if (options.body) params.set("body", options.body);

  const query = params.toString();
  return `mailto:${address}${query ? `?${query}` : ""}`;
}
