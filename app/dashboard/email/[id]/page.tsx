import { findInquiry } from "../../../inquiry-store";
import { formatReceivedAt, inboxPath, messageId } from "../../inbox-view";
import { requireOwner } from "../../session";
import styles from "../../dashboard.module.css";

export default async function EmailPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ after?: string | string[]; view?: string | string[] }>;
}) {
  await requireOwner();
  const id = messageId((await params).id);
  const query = await searchParams;
  const after = messageId(query.after);
  const archived = query.view === "archived";
  const email = id ? readInquiry(id) : null;

  return (
    <>
      <div className={styles.actions}>
        <a className={styles.secondary} href={inboxPath(archived, after)}>{archived ? "← Back to Archived" : "← Back to Inbox"}</a>
        {email && (
          <form method="post" action="/dashboard/session">
            <input type="hidden" name="id" value={email.id} />
            <button className={styles.secondary} name="action" value={email.archived ? "restore" : "archive"}>
              {email.archived ? "Restore to Inbox" : "Archive"}
            </button>
          </form>
        )}
        <form method="post" action="/dashboard/session">
          <button className={styles.secondary} name="action" value="logout">Sign out</button>
        </form>
      </div>
      <article className={styles.reader}>
        {email ? (
          <>
            <header className={styles.readerHead}>
              <h1>{email.subject}</h1>
              <dl>
                <div><dt>Contact</dt><dd>{email.contact}</dd></div>
                <div><dt>Received</dt><dd><time dateTime={email.receivedAt}>{formatReceivedAt(email.receivedAt)}</time></dd></div>
              </dl>
            </header>
            <div className={styles.body}>{email.text || "This email has no readable text."}</div>
          </>
        ) : (
          <div className={styles.readerHead}>
            <h1>Message unavailable</h1>
            <p>{email === undefined ? "This inquiry could not be loaded. Try again in a moment." : "This message could not be found among the website inquiries."}</p>
          </div>
        )}
      </article>
    </>
  );
}

function readInquiry(id: string) {
  try { return findInquiry(id) ?? null; }
  catch { return undefined; }
}
