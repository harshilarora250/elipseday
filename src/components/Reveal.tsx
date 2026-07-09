'use client';

import { useEffect } from 'react';

// A single observer that watches every `.reveal` element on the page and
// adds `.visible` when it scrolls into view. Mounted once in the layout.
// Using one global observer (instead of per-element wrappers) keeps markup
// clean and preserves CSS :nth-child selectors on cards.
export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    const scan = () => {
      document
        .querySelectorAll('.reveal:not(.visible)')
        .forEach((el) => io.observe(el));
    };
    scan();
    // Re-scan shortly after mount in case of hydration timing.
    const t = setTimeout(scan, 100);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return null;
}
