'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Page transition wash.
 *
 * On every pathname change, a yellow sheet sweeps down the viewport using the
 * `c3-wash` keyframe defined in globals.css. The animation runs once per
 * navigation. Respects prefers-reduced-motion (CSS kills the animation).
 */
export default function PageTransition() {
  const pathname = usePathname();
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [pathname]);

  return (
    <div
      key={animKey}
      className="c3-wash run"
      aria-hidden="true"
    />
  );
}
