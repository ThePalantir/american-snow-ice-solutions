import { formatReceivedAt, getMessage, inboxConfiguration, messageId } from "../../inbox";
import { requireOwner } from "../../session";
import styles from "../../dashboard.module.css";

export default async function EmailPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ after?: string | string[] }>;
}) {
  await requireOwner();
  const id = messageId((await params).id);
  const after = messageId((await searchParams).after);
  const config = inboxConfiguration();
  const email = config && id ? await getMessage(config, id).catch(() => undefined) : null;

  return (
    <>
      <div className={styles.actions}>
        <a className={styles.secondary} href={after ? `/dashboard?after=${after}` : "/dashboard"}>← Back to inbox</a>
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
                <div><dt>From</dt><dd>{email.from}</dd></div>
                <div><dt>To</dt><dd>{email.to.join(", ") || "Undisclosed recipients"}</dd></div>
                <div><dt>Received</dt><dd><time dateTime={email.receivedAt}>{formatReceivedAt(email.receivedAt)}</time></dd></div>
              </dl>
            </header>
            <div className={styles.body}>{email.text || "This email has no readable text."}</div>
            {email.truncated && <p className={styles.notice}>This preview shows the beginning of a long message.</p>}
            {email.attachments.length > 0 && (
              <section className={styles.attachments} aria-label="Attachment names">
                <h2>Attachments</h2>
                <ul>{email.attachments.map(({ id, filename }) => <li key={id}>{filename || "Unnamed attachment"}</li>)}</ul>
              </section>
            )}
          </>
        ) : (
          <div className={styles.readerHead}>
            <h1>Message unavailable</h1>
            <p>{email === undefined ? "Resend could not load this message. Try again in a moment." : "The message could not be found in the company inbox."}</p>
          </div>
        )}
      </article>
    </>
  );
}
