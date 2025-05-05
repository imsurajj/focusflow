'use client';

import { useEffect } from 'react';

// Add the missing type definition for adsbygoogle
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  adSlot: string;
  style?: React.CSSProperties;
}

export default function AdUnit({ adSlot, style }: AdUnitProps) {
  useEffect(() => {
    try {
      // Push the ad only when component mounts
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error loading ad:', error);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', overflow: 'hidden', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1667462772689046"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
} 