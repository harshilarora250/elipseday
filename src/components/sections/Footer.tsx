import type { Site, ContactLink } from '@/lib/types';
import { FooterSquiggle } from '@/components/Decor';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Wins', href: '#achievements' },
  { label: 'Content', href: '#content' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer({
  site,
  links,
}: {
  site: Site;
  links: ContactLink[];
}) {
  const words = site.name.split(/\s+/);
  const last = words.length > 1 ? words.pop() : '';
  const first = words.join(' ');

  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-name">
            {first} {last && <em>{last}</em>}
          </div>
          <p className="footer-tag">{site.tagline}</p>
          <div className="footer-status">
            <span className="status-dot" />
            {site.statusText}
          </div>
        </div>
        <div className="footer-col">
          <span className="footer-h">Explore</span>
          {navLinks.map((l) => (
            <a href={l.href} key={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="footer-col">
          <span className="footer-h">Connect</span>
          {links.map((l) => (
            <a
              key={l.id}
              href={l.url || '#'}
              target={l.url?.startsWith('http') ? '_blank' : undefined}
              rel={l.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <FooterSquiggle />
      <div className="footer-bottom">
        <span className="foot-copy">{site.copyright}</span>
        <a href="#hero" className="back-top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
