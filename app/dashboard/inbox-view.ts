const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export function messageId(value: unknown) {
  return typeof value === "string" && uuid.test(value) ? value : undefined;
}

export function inboxPath(archived: boolean, after?: string) {
  const query = new URLSearchParams();
  if (archived) query.set("view", "archived");
  if (after) query.set("after", after);
  return query.size ? `/dashboard?${query}` : "/dashboard";
}

const receivedDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York",
});

export function formatReceivedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : `${receivedDate.format(date)} ET`;
}
