export const quoteSubjectPrefix = "New ASIS consultation request — ";

// Accept the team's Resend-provided receiving address. A dedicated address
// serves as both the copy destination and the owner inbox filter.
export function quoteInboxAddress(value: string | undefined) {
  const address = value?.trim().toLowerCase();
  return address && address.length <= 254
    && /^[a-z0-9_+-]+(?:\.[a-z0-9_+-]+)*@[a-z0-9]+(?:-[a-z0-9]+)*\.resend\.app$/.test(address)
    ? address : undefined;
}
