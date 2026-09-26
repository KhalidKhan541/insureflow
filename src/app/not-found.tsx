import Link from 'next/link';

/**
 * 404 page. The gradient text is intentionally self-contained (inline styles)
 * so it renders correctly even before global stylesheets load.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center dark:bg-slate-950">
      <p
        style={{
          background: 'linear-gradient(90deg, #0d9488 0%, #0ea5e9 55%, #14b8a6 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          fontSize: 'clamp(4.5rem, 16vw, 8rem)',
          fontWeight: 800,
          letterSpacing: '-0.05em',
          lineHeight: 1,
          margin: 0,
        }}
      >
        404
      </p>
      <h1
        style={{
          marginTop: '1.25rem',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.02em',
        }}
        className="dark:!text-slate-50"
      >
        This page is out of coverage
      </h1>
      <p
        style={{
          marginTop: '0.75rem',
          maxWidth: '32rem',
          fontSize: '0.975rem',
          lineHeight: 1.6,
          color: '#64748b',
        }}
      >
        The route you requested doesn&apos;t exist — it may have been renamed, lapsed, or never
        bound in the first place. Head back to the InsureFlow overview to keep working.
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.7rem 1.4rem',
            borderRadius: '10px',
            background: '#0d9488',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 10px 25px -5px rgba(13,148,136,0.35)',
          }}
        >
          Back to home
        </Link>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.7rem 1.4rem',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            fontSize: '0.9rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
