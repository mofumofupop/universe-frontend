export default function Head() {
  // cache buster in development to avoid stale favicon cache
  const cacheBuster = process.env.NODE_ENV === 'development' ? `?v=${Date.now()}` : '';

  return (
    <>
      {/* Favicon links (ICO preferred) */}
      <link rel="icon" href={`/favicon.png${cacheBuster}`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`/favicon.png${cacheBuster}`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`/favicon.png${cacheBuster}`} />
      <link rel="shortcut icon" href={`/favicon.png${cacheBuster}`} />
      <link rel="apple-touch-icon" sizes="180x180" href={`/favicon.png${cacheBuster}`} />
      <meta name="theme-color" content="#0f172a" />

      {/* Document title */}
      <title>U&apos;n&apos;IVERSE</title>      <meta name="description" content="U'n'IVERSE — Create your own profile card easily and share it with the people you meet to expand your universe." />

      {/* Open Graph / Twitter */}
      <meta property="og:title" content="U'n'IVERSE" />
      <meta property="og:description" content="U'n'IVERSE — Create your own profile card easily and share it with the people you meet to expand your universe." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/favicon.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="U'n'IVERSE" />
      <meta name="twitter:description" content="U'n'IVERSE — Create your own profile card easily and share it with the people you meet to expand your universe." />
      <meta name="twitter:image" content="/favicon.png" />
      {/* PWA manifest and mobile meta */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Optional: preconnect to Google Fonts to speed up font load */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  );
}