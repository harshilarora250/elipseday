import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProjectBySlug, getProjects, getSite } from '@/lib/content';

export const dynamic = 'force-dynamic';

function parseTags(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project not found' };
  const site = getSite();
  return {
    title: `${project.title} — ${site.name}`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.slice(0, 160),
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !project.visible) notFound();

  const tags = parseTags(project.tags);

  return (
    <section id="hero" className="detail" style={{ minHeight: 'auto' }}>
      <div className="halftone ht-hero" />
      <div className="detail-shell">
        <Link href="/#projects" className="detail-back">
          ← Back to all
        </Link>
        {project.year && <div className="detail-kicker">{project.year}</div>}
        <h1 className="detail-title">{project.title}</h1>

        {tags.length > 0 && (
          <div className="detail-tags">
            {tags.map((t, i) => (
              <span className="pc-tag" key={i}>
                {t}
              </span>
            ))}
          </div>
        )}

        {project.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="detail-hero-img" src={project.image} alt={project.title} />
        )}

        <p className="detail-body">{project.description}</p>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-cta"
          >
            Visit project ↗
          </a>
        )}
      </div>
    </section>
  );
}

export function generateStaticParams() {
  try {
    return getProjects(true).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
