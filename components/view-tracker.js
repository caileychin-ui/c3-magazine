'use client';

import { useEffect, useState } from 'react';

/**
 * Fires a view-tracking request when an article page loads,
 * then displays the view count. Mounted at the bottom of article pages.
 */
export default function ViewTracker({ slug }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    // Fire the tracking request
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.count != null) setViews(data.count);
      })
      .catch(() => {
        // Silent fail — don't disrupt the reading experience
      });
  }, [slug]);

  if (views == null) return null;

  return (
    <span
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        color: 'var(--text-caption)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
      }}
    >
      👁 {views} {views === 1 ? 'read' : 'reads'}
    </span>
  );
}
