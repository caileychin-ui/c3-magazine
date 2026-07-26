'use client';

import { useEffect, useState } from 'react';

/**
 * Floating pastel bubbles + polka dots background layer.
 *
 * Renders fixed-position, non-interactive pastel circles that drift around
 * behind the page content using the `c3-float` and `c3-drift` keyframes already
 * defined in globals.css.
 *
 * Respects prefers-reduced-motion (the CSS @media query kills animation).
 */
const PASTELS = [
  { color: 'var(--blue)',   size: 120 },
  { color: 'var(--pink)',   size: 90 },
  { color: 'var(--yellow)', size: 140 },
  { color: 'var(--mint)',   size: 70 },
  { color: 'var(--blue)',   size: 60 },
  { color: 'var(--pink)',   size: 100 },
  { color: 'var(--yellow)', size: 50 },
  { color: 'var(--mint)',   size: 110 },
];

// Polka dot seed positions (percent-based so they stay responsive)
const DOTS = [
  { top: '12%', left: '8%',  size: 14, color: 'var(--blue)',   dur: 18, delay: 0 },
  { top: '22%', left: '85%', size: 10, color: 'var(--pink)',   dur: 22, delay: 1 },
  { top: '68%', left: '15%', size: 18, color: 'var(--yellow)', dur: 16, delay: 2 },
  { top: '45%', left: '92%', size: 12, color: 'var(--mint)',   dur: 20, delay: 0.5 },
  { top: '85%', left: '80%', size: 8,  color: 'var(--pink)',   dur: 24, delay: 1.5 },
  { top: '35%', left: '50%', size: 6,  color: 'var(--blue)',   dur: 14, delay: 3 },
];

export default function FloatingBubbles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Large floating pastel bubbles */}
      {PASTELS.map((b, i) => {
        const pos = {
          top: `${15 + ((i * 37) % 70)}%`,
          left: `${5 + ((i * 43) % 88)}%`,
        };
        return (
          <div
            key={`bubble-${i}`}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              background: b.color,
              opacity: 0.28,
              filter: 'blur(1px)',
              animation: `c3-float ${10 + (i % 4) * 3}s ease-in-out ${i * 0.7}s infinite`,
              willChange: 'transform',
            }}
          />
        );
      })}

      {/* Small polka dots */}
      {DOTS.map((d, i) => (
        <div
          key={`dot-${i}`}
          className="dot"
          style={{
            position: 'absolute',
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: d.color,
            opacity: 0.4,
            '--d': `${d.dur}s`,
            '--delay': `${d.delay}s`,
            animation: `c3-drift ${d.dur}s ease-in-out ${d.delay}s infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
