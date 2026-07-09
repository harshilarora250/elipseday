import type { About as AboutType, Stat, CurrentlyItem } from '@/lib/types';
import StatCounters from '@/components/StatCounters';
import { Squiggle } from '@/components/Decor';
import { withHighlights } from '@/lib/highlight';

export default function About({
  about,
  stats,
  currently,
}: {
  about: AboutType;
  stats: Stat[];
  currently: CurrentlyItem[];
}) {
  const paragraphs = about.paragraphs.split('\n').filter((p) => p.trim());

  return (
    <section id="about">
      <div className="shell">
        <div className="sec-kicker reveal">{about.kicker}</div>
        <div className="sec-title reveal">{about.title}</div>
        <div className="about-grid">
          <div>
            <div className="about-rule reveal" />
            <div className="about-body reveal">
              {paragraphs.map((p, i) => (
                <p key={i}>{withHighlights(p)}</p>
              ))}
            </div>
            <div className="reveal">
              <Squiggle className="squiggle" />
            </div>
            {stats.length > 0 && (
              <div className="reveal rd1">
                <StatCounters stats={stats} />
              </div>
            )}
          </div>
          {currently.length > 0 && (
            <div className="reveal rd2">
              <div className="currently">
                <span className="tape t1" />
                <span className="tape t2" />
                <div className="cur-label">Right now</div>
                {currently.map((c) => (
                  <div className="cur-item" key={c.id}>
                    <span className="cur-dot" />
                    <div>
                      <span className="cur-text">{c.text}</span>
                      {c.sub && <span className="cur-sub">{c.sub}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
