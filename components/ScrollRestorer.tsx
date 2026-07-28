"use client";

import { useEffect, useRef } from 'react';

interface ScrollRestorerProps {
  storageKey: string;
}

export function ScrollRestorer({ storageKey }: ScrollRestorerProps) {
  const isRestored = useRef(false);

  useEffect(() => {
    // 1. Restore scroll position on mount
    if (!isRestored.current && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          // A small delay ensures the DOM has laid out the markdown content
          setTimeout(() => {
            window.scrollTo({ top: parsed, behavior: 'instant' });
          }, 100);
        }
      }
      isRestored.current = true;
    }

    // 2. Save scroll position on scroll
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.setItem(storageKey, window.scrollY.toString());
      }, 500); // Debounce save
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [storageKey]);

  return null;
}
