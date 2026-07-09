import { getPublicData } from '@/lib/content';
import RevealObserver from '@/components/Reveal';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Achievements from '@/components/sections/Achievements';
import Content from '@/components/sections/Content';
import Contact from '@/components/sections/Contact';
import { Wave } from '@/components/Decor';

// Used inside the admin live-preview iframe so the owner can see
// saved changes without leaving /admin. Excluded from search indexing.
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { robots: { index: false, follow: false } };
}

export default async function Preview() {
  const data = await getPublicData();
  const metaItems = [
    { label: 'Based in', value: 'The Internet' },
    { label: 'Currently', value: data.currently[0]?.text || '—' },
    { label: 'Status', value: data.hero.statusText || 'Available' },
  ];

  return (
    <>
      <RevealObserver />
      <main>
        <Hero hero={data.hero} metaItems={metaItems} />
        {data.projects.length > 0 && (
          <>
            <div className="checker" aria-hidden="true" />
            <Projects projects={data.projects} />
          </>
        )}
        {data.achievements.length > 0 && (
          <>
            <Wave bg="var(--lavender)" fill="var(--yellow)" variant="curve1" />
            <Achievements items={data.achievements} />
          </>
        )}
        {data.contentItems.length > 0 && (
          <>
            <Wave bg="var(--yellow)" fill="var(--mint)" variant="zigzag" />
            <Content items={data.contentItems} note={data.about.accent} />
          </>
        )}
        <Wave bg="var(--mint)" fill="var(--dark)" variant="curve2" />
        <Contact contact={data.contact} links={data.contactLinks} />
      </main>
    </>
  );
}
