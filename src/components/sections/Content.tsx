import type { ContentItem } from '@/lib/types';

export default function Content({
  items,
  note,
}: {
  items: ContentItem[];
  note: string;
}) {
  return (
    <section id="content">
      <div className="shell">
        <div className="sec-kicker reveal">where i post</div>
        <div className="sec-title reveal">CONTENT</div>
        <div className="platforms">
          {items.map((c, i) => (
            <a
              className={`platform-row reveal ${i ? `rd${Math.min(i, 3)}` : ''}`}
              key={c.id}
              href={c.url || '#'}
              target={c.url?.startsWith('http') ? '_blank' : undefined}
              rel={c.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <div>
                <span className="pf-label">{c.platform}</span>
                <div className="pf-name">{c.name}</div>
              </div>
              <p className="pf-desc">{c.description}</p>
              <span className="pf-link">{c.linkText || 'Open ↗'}</span>
            </a>
          ))}
        </div>
        {note && <div className="content-note reveal">{note}</div>}
      </div>
    </section>
  );
}
