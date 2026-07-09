import { getPublicData } from '@/lib/content';
import Nav from '@/components/Nav';
import RevealObserver from '@/components/Reveal';
import Marquee from '@/components/Marquee';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Achievements from '@/components/sections/Achievements';
import Content from '@/components/sections/Content';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import { Wave } from '@/components/Decor';

export const dynamic = 'force-dynamic'; // always reflect latest admin edits

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Wins', href: '#achievements' },
  { label: 'Content', href: '#content' },
  { label: 'Contact', href: '#contact' },
];

export default async function Home() {
  const data = await getPublicData();

  const metaItems = [
    { label: 'Based in', value: 'The Internet' },
    { label: 'Currently', value: data.currently[0]?.text || '—' },
    { label: 'Status', value: data.hero.statusText || 'Available' },
  ];

  return (
    <>
      <RevealObserver />
      <Nav
        statusText={data.site.statusText}
        ctaText={data.site.navCtaText}
        links={NAV_LINKS}
      />

      <main>
        <Hero hero={data.hero} metaItems={metaItems} />

        {data.marquee1.length > 0 && (
          <Marquee items={data.marquee1} variant="m1" dot="/" />
        )}
        {data.marquee2.length > 0 && (
          <Marquee items={data.marquee2} variant="m2" dot="✶" />
        )}

        <About
          about={data.about}
          stats={data.stats}
          currently={data.currently}
        />

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

      <Footer site={data.site} links={data.contactLinks} />
    </>
  );
}
