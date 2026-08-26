import { useEffect, useRef } from 'react';

/** Fires `onVisible` when the sentinel enters the scrollport. */
export default function InfiniteScrollSentinel({ onVisible, disabled, root }) {
  const ref = useRef(null);

  useEffect(() => {
    if (disabled) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible();
      },
      { root: root || null, rootMargin: '180px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled, onVisible, root]);

  return <div ref={ref} className="h-6 w-full" aria-hidden="true" />;
}
