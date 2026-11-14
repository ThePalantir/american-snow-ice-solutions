import { inquiryPage } from "../inquiry-store";
import { formatReceivedAt, inboxPath, messageId } from "./inbox-view";
import { requireOwner } from "./session";
import styles from "./dashboard.module.css";

export default async function DashboardPage({ searchParams }: {
  searchParams: Promise<{ after?: string | string[]; view?: string | string[]; status?: string | string[] }>;
}) {
  await requireOwner();
  const query = await searchParams;
  const after = messageId(query.after);
  const archived = query.view === "archived";
  const pageUrl = inboxPath(archived, after);
  const viewQuery = pageUrl.slice("/dashboard".length);
  const inbox = readPage(archived, after);

  return (
    <>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>Owner dashboard</p>
          <h1>Website inquiries</h1>
        </div>
        <div className={styles.actions}>
          <a className={styles.secondary} href={pageUrl}>Refresh</a>
          <form method="post" action="/dashboard/session">
            <button className={styles.secondary} name="action" value="logout">Sign out</button>
          </form>
        </div>
      </div>
      {inbox && (
        <dl className={styles.counts} aria-label="Inquiry volume">
          <div><dt>Last 7 days</dt><dd>{inbox.counts.week}</dd></div>
          <div><dt>Last 30 days</dt><dd>{inbox.counts.month}</dd></div>
        </dl>
      )}
      <section className={styles.panel} aria-label="Received email">
        <nav className={styles.panelHead} aria-label="Inquiry folders">
          <a className={styles.secondary} href="/dashboard" aria-current={!archived ? "page" : undefined}>Inbox</a>
          <a className={styles.secondary} href={inboxPath(true)} aria-current={archived ? "page" : undefined}>Archived</a>
        </nav>
        {query.status === "archived" && <p className={styles.notice} role="status">Inquiry archived.</p>}
        {query.status === "restored" && <p className={styles.notice} role="status">Inquiry restored to Inbox.</p>}
        {inbox?.messages.length ? (
          <ul className={styles.messages}>
            {inbox.messages.map((message) => (
              <li key={message.id}>
                <a href={`/dashboard/email/${message.id}${viewQuery}`} className={styles.message}>
                  <span className={styles.sender}>{message.contact}</span>
                  <span>{message.subject}</span>
                  <time dateTime={message.receivedAt}>{formatReceivedAt(message.receivedAt)}</time>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.notice} role={!inbox ? "alert" : undefined}>
            {!inbox ? "The saved inquiry history is unavailable. Try refreshing."
              : archived ? "No archived inquiries." : "No inquiries in Inbox."}
          </p>
        )}
        {(inbox?.next || after) && (
          <nav className={styles.pagination} aria-label="Inbox pages">
            {after && <a className={styles.secondary} href={inboxPath(archived)}>Latest messages</a>}
            {inbox?.next && <a className={styles.secondary} href={inboxPath(archived, inbox.next)}>Older messages <span aria-hidden="true">→</span></a>}
          </nav>
        )}
      </section>
    </>
  );
}

function readPage(archived: boolean, after?: string) {
  try { return inquiryPage(archived, after); }
  catch { return null; }
}
