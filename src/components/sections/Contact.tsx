import type { Contact as ContactType, ContactLink } from '@/lib/types';
import CopyEmail from '@/components/CopyEmail';

export default function Contact({
  contact,
  links,
}: {
  contact: ContactType;
  links: ContactLink[];
}) {
  const afterLines = contact.headlineAfter.split('\n').filter(Boolean);

  return (
    <section id="contact">
      <div className="halftone ht-contact" />
      <div className="shell">
        {contact.featuredCtaText && (
          <div className="content-note reveal" style={{ marginBottom: '2.5rem' }}>
            {contact.featuredCtaText}
          </div>
        )}
        <div className="contact-grid">
          <div>
            <div className="sec-kicker reveal">{contact.kicker}</div>
            <h2 className="contact-head reveal">
              {contact.headlineBefore}
              {contact.headlineCircled && (
                <em className="circled">
                  {contact.headlineCircled}
                  <svg viewBox="0 0 200 90" preserveAspectRatio="none">
                    <ellipse cx="100" cy="45" rx="94" ry="38" pathLength={1} />
                  </svg>
                </em>
              )}
              {afterLines.map((line, i) => (
                <span key={i}>
                  <br />
                  {line}
                </span>
              ))}
            </h2>
            <p className="contact-body reveal">{contact.body}</p>
            {contact.ctaText && (
              <a href={contact.ctaUrl || '#'} className="contact-cta reveal rd1">
                {contact.ctaText}
              </a>
            )}
            {contact.email && (
              <CopyEmail email={contact.email} label={contact.copyText || 'Copy email'} />
            )}
          </div>
          <div className="contact-links reveal rd1">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.url || '#'}
                target={l.url?.startsWith('http') ? '_blank' : undefined}
                rel={l.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="cl-row"
              >
                <div>
                  <span className="cl-label">{l.label}</span>
                  <span className="cl-value">{l.value}</span>
                </div>
                <span className="cl-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
