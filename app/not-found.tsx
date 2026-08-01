import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="container not-found__content">
        <p className="eyebrow eyebrow--light">404 / Route not found</p>
        <h1>This route is<br />snowed in.</h1>
        <p>The page may have moved, but the operations center is still ready.</p>
        <div className="button-row">
          <Link className="button button--signal" href="/">Return home <span>→</span></Link>
          <Link className="button button--outline" href="/contact">Contact operations <span>↗</span></Link>
        </div>
      </div>
    </main>
  );
}
