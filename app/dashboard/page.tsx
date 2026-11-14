import { inquiryPage } from "../inquiry-store";
import { formatReceivedAt, importOlderInquiries, messageId } from "./inbox";
import { requireOwner } from "./session";
import styles from "./dashboard.module.css";

export default async function DashboardPage({ searchParams }: {
  searchParams: Promise<{ after?: string | string[] }>;
}) {
  await requireOwner();
  const after = messageId((await searchParams).after);
  const pageUrl = after ? `/dashboard?after=${after}` : "/dashboard";
  const importing = await importOlderInquiries().catch(() => null);
  const inbox = readPage(after);

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
        <div className={styles.panelHead}><h2>{after ? "Older messages" : "Latest messages"}</h2></div>
        {inbox && importing === true && <p className={styles.notice}>Refresh again to bring in more older inquiries from Resend.</p>}
        {inbox && importing === null && <p className={styles.notice}>Resend history could not finish importing. Refresh to retry.</p>}
        {inbox?.messages.length ? (
          <ul className={styles.messages}>
            {inbox.messages.map((message) => (
              <li key={message.id}>
                <a href={`/dashboard/email/${message.id}${after ? `?after=${after}` : ""}`} className={styles.message}>
                  <span className={styles.sender}>{message.contact}</span>
                  <span>{message.subject}</span>
                  <time dateTime={message.receivedAt}>{formatReceivedAt(message.receivedAt)}</time>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.notice} role={!inbox ? "alert" : undefined}>
            {inbox ? "No saved inquiries yet." : "The saved inquiry history is unavailable. Try refreshing."}
          </p>
        )}
        {(inbox?.next || after) && (
          <nav className={styles.pagination} aria-label="Inbox pages">
            {after && <a className={styles.secondary} href="/dashboard">Latest messages</a>}
            {inbox?.next && <a className={styles.secondary} href={`/dashboard?after=${inbox.next}`}>Older messages <span aria-hidden="true">→</span></a>}
          </nav>
        )}
      </section>
    </>
  );
}

function readPage(after?: string) {
  try { return inquiryPage(after); }
  catch { return null; }
}
