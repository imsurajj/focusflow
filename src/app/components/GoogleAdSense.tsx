'use client';

import Script from 'next/script';

export default function GoogleAdSense() {
  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1667462772689046"
      crossOrigin="anonymous"
    />
  );
} 