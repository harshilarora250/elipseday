import Link from 'next/link';
import type { Project } from '@/lib/types';

function parseTags(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects">
      <div className="shell">
        <div className="sec-kicker reveal">what i&apos;m building</div>
        <div className="sec-title reveal">PROJECTS</div>
        <div className="projects-list">
          {projects.map((p, i) => {
            const tags = parseTags(p.tags);
            const num = String(i + 1).padStart(2, '0');
            const rd = `rd${(i % 3) + 1}`;
            return (
              <Link
                href={`/projects/${p.slug}`}
                className={`project-card reveal ${rd}`}
                key={p.id}
              >
                <span className="pc-ghost" aria-hidden="true">
                  {num}
                </span>
                <div className="pc-text">
                  {tags.length > 0 && (
                    <div className="pc-tags">
                      {tags.map((t, ti) => (
                        <span className="pc-tag" key={ti}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="pc-name">{p.title}</h3>
                  <p className="pc-desc">{p.description}</p>
                </div>
                {p.image && (
                  <div className="pc-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.title} loading="lazy" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
