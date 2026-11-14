import { formatReceivedAt, inboxConfiguration, listMessages, messageId } from "./inbox";
import { requireOwner } from "./session";
import styles from "./dashboard.module.css";

export default async function DashboardPage({ searchParams }: {
  searchParams: Promise<{ after?: string | string[] }>;
}) {
  await requireOwner();
  const after = messageId((await searchParams).after);
  const pageUrl = after ? `/dashboard?after=${after}` : "/dashboard";
  const config = inboxConfiguration();
  const inbox = config ? await listMessages(config, after).catch(() => null) : null;

  return (
    <>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>Owner dashboard</p>
          <h1>Company inbox</h1>
          <p>Incoming email received through Resend.</p>
        </div>
        <div className={styles.actions}>
          <a className={styles.secondary} href={pageUrl}>Refresh</a>
          <form method="post" action="/dashboard/session">
            <button className={styles.secondary} name="action" value="logout">Sign out</button>
          </form>
        </div>
      </div>
      <section className={styles.panel} aria-label="Received email">
        <div className={styles.panelHead}><h2>{after ? "Older messages" : "Latest messages"}</h2></div>
        {inbox?.messages.length ? (
          <ul className={styles.messages}>
            {inbox.messages.map((message) => (
              <li key={message.id}>
                <a href={`/dashboard/email/${message.id}${after ? `?after=${after}` : ""}`} className={styles.message}>
                  <span className={styles.sender}>{message.from}</span>
                  <span>{message.subject}</span>
                  <time dateTime={message.receivedAt}>{formatReceivedAt(message.receivedAt)}</time>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.notice} role={!inbox && config ? "alert" : undefined}>
            {!config ? "The company inbox is awaiting Resend setup."
              : !inbox ? "Resend is unavailable right now. Try refreshing the inbox."
                : inbox.next ? "No company messages on this page. Older messages are available."
                  : "No company messages were found on this page."}
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
