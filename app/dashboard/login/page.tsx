import { redirect } from "next/navigation";
import { loginConfigured, signedIn } from "../session";
import styles from "../dashboard.module.css";

const loginErrors: Record<string, string> = {
  invalid: "The username or password was incorrect.",
  limited: "Too many attempts. Wait 15 minutes and try again.",
};

export default async function LoginPage({ searchParams }: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  if (await signedIn()) redirect("/dashboard");
  const { status } = await searchParams;
  const configured = loginConfigured();
  const error = typeof status === "string" && Object.hasOwn(loginErrors, status) ? loginErrors[status] : null;
  return (
    <section className={styles.login} aria-labelledby="owner-sign-in">
      <p className={styles.eyebrow}>Owner dashboard</p>
      <h1 id="owner-sign-in">Owner sign-in</h1>
      <p>Sign in to view inquiries from the website’s quote form.</p>
      {configured ? (
        <form className={styles.loginForm} action="/dashboard/session" method="post">
          <input type="hidden" name="action" value="login" />
          <label>Username<input name="username" autoComplete="username" required maxLength={128} /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="submit" className={styles.primary}>Sign in</button>
        </form>
      ) : <p className={styles.error} role="status">Owner sign-in is awaiting setup.</p>}
    </section>
  );
}
