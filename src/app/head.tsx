export default function Head() {
  // cache buster in development to avoid stale favicon cache
  const cacheBuster = process.env.NODE_ENV === 'development' ? `?v=${Date.now()}` : '';

  return (
    <>
      {/* Favicon links (ICO preferred) */}
      <link rel="icon" href={`/favicon.ico${cacheBuster}`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`/favicon.png${cacheBuster}`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`/favicon.png${cacheBuster}`} />
      <link rel="shortcut icon" href={`/favicon.ico${cacheBuster}`} />
      <link rel="apple-touch-icon" sizes="180x180" href={`/favicon.png${cacheBuster}`} />
      <meta name="theme-color" content="#0f172a" />

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