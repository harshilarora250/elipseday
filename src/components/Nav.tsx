'use client';

import { useEffect, useState } from 'react';

interface NavProps {
  statusText: string;
  ctaText: string;
  links: { label: string; href: string }[];
}

export default function Nav({ statusText, ctaText, links }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // active link highlight
  useEffect(() => {
    const secs = Array.from(document.querySelectorAll('section[id]'));
    const navlinks = Array.from(document.querySelectorAll('.nav-links a'));
    const onScroll = () => {
      let cur = '';
      secs.forEach((s) => {
        if (window.scrollY >= (s as HTMLElement).offsetTop - 220) cur = s.id;
      });
      navlinks.forEach((l) => {
        l.classList.toggle(
          'active',
          l.getAttribute('href') === `#${cur}`
        );
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // smooth scroll for in-page anchors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  return (
    <>
      <nav id="main-nav" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-status">
          <span className="status-dot" />
          <span>{statusText}</span>
        </div>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <a href="#contact" className="nav-cta">
            {ctaText}
          </a>
          <button
            className="burger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className="mobile-menu" id="mobile-menu">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="mm-link"
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <div className="mm-foot">
          <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>
            {ctaText}
          </a>
        </div>
      </div>
    </>
  );
}
