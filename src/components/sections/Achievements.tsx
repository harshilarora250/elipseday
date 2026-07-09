import type { Achievement } from '@/lib/types';

export default function Achievements({ items }: { items: Achievement[] }) {
  return (
    <section id="achievements">
      <div className="halftone ht-ach" />
      <div className="shell">
        <div className="sec-kicker reveal">the receipts</div>
        <div className="sec-title reveal">THE WINS</div>
        <div className="achieve-grid">
          {items.map((a, i) => (
            <div className={`achieve-cell reveal ${i % 2 ? 'rd1' : ''}`} key={a.id}>
              {a.year && <div className="ac-year">{a.year}</div>}
              <div className="ac-title">{a.title}</div>
              <p className="ac-desc">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
