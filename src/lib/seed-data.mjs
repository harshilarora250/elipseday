// Shared schema + demo (seed) content.
// Imported by both the Next.js app (src/lib/db.ts) and the standalone
// seed script (scripts/seed.mjs) so the schema stays in one place.

import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const DB_PATH = join(process.cwd(), 'data', 'portfolio.db');

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS site (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  statusText TEXT NOT NULL DEFAULT '',
  copyright TEXT NOT NULL DEFAULT '',
  navCtaText TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS hero (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  kicker TEXT NOT NULL DEFAULT '',
  nameLine1 TEXT NOT NULL DEFAULT '',
  nameLine2 TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  rotatingWords TEXT NOT NULL DEFAULT '',
  statusText TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  starImage TEXT NOT NULL DEFAULT '',
  floatNote TEXT NOT NULL DEFAULT '',
  chips TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  kicker TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  paragraphs TEXT NOT NULL DEFAULT '',
  accent TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS marquee (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  m1 TEXT NOT NULL DEFAULT '',
  m2 TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS contact (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  kicker TEXT NOT NULL DEFAULT '',
  headlineBefore TEXT NOT NULL DEFAULT '',
  headlineCircled TEXT NOT NULL DEFAULT '',
  headlineAfter TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  ctaText TEXT NOT NULL DEFAULT '',
  ctaUrl TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  copyText TEXT NOT NULL DEFAULT '',
  featuredCtaText TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value INTEGER NOT NULL DEFAULT 0,
  suffix TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS currently_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL DEFAULT '',
  sub TEXT NOT NULL DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS content_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  linkText TEXT NOT NULL DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contact_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL DEFAULT '',
  value TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 0
);
`;

// ---- Demo content (edit freely from /admin) ----
export const SEED = {
  site: {
    name: 'AVERY QUINN',
    tagline: 'Founder, builder, creator. Doing too much with too little — and refusing to stop.',
    statusText: 'open to collabs',
    copyright: '© 2026 Avery Quinn',
    navCtaText: 'Get in touch',
  },
  hero: {
    kicker: 'founder · builder · creator',
    nameLine1: 'AVERY',
    nameLine2: 'QUINN',
    note: 'call me Ave ✶',
    subtitle:
      "I make weird, useful things on the internet and refuse to pick just one lane.",
    rotatingWords: ['Founder', 'Builder', '21km Runner', 'Content Creator', 'Chaos Connoisseur'].join('\n'),
    statusText: 'open to collabs',
    email: 'hello@averyquinn.com',
    starImage: '',
    floatNote: 'still figuring it out (on purpose)',
    chips: JSON.stringify([
      { text: 'personal brand', color: 'yellow' },
      { text: 'AI tinkerer', color: 'mint' },
      { text: 'night owl', color: 'pink' },
    ]),
  },
  about: {
    kicker: 'the human behind it',
    title: 'WHO I AM',
    paragraphs: [
      "I'm Avery — everyone calls me Ave. I have [[too many things going on at once]] and I've stopped pretending that's a problem.",
      "Right now I'm building a small AI tool because people do impressive things every day and have no clean way to prove them. [[It evaluates — it doesn't flatter.]] Weak evidence gets low confidence, and numbers are never invented.",
      'Before this I sold my first website to a local business, ran a half marathon, and somehow coordinated events for 500+ people. I don\'t fully know how, either.',
      '[[Mindset: execution over theory. Always has been.]]',
    ].join('\n'),
    accent: 'creator, not influencer',
  },
  marquee: {
    m1: 'Founder / Builder / 21km Runner / Content Creator / Execution over Theory / Unseen — Evidence Engine',
    m2: 'Doing too much with too little ✶ Refusing to stop ✶ Build in public ✶ Show up daily',
  },
  contact: {
    kicker: 'say hi',
    headlineBefore: 'Got an ',
    headlineCircled: 'idea?',
    headlineAfter: '\nLet\'s build.',
    body: "I'm open to collabs, interesting projects, and conversations with people who are actually doing things. Reach out.",
    ctaText: 'Email me ↗',
    ctaUrl: 'mailto:hello@averyquinn.com',
    email: 'hello@averyquinn.com',
    copyText: 'Copy email address',
    featuredCtaText: 'Currently booking 2 collabs for the summer →',
  },
  stats: [
    { value: 21, suffix: '', label: 'km at 15' },
    { value: 5, suffix: '', label: 'team built' },
    { value: 500, suffix: '+', label: 'event attendees' },
  ],
  currently: [
    { text: 'Building my AI side-project', sub: 'evidence engine · proof over claims' },
    { text: 'Finishing the semester', sub: 'school exams · this season' },
    { text: 'Growing my socials', sub: 'Instagram · content creation' },
    { text: 'Freelance web projects', sub: 'local business sites' },
    { text: 'Learning hardware', sub: 'Arduino · robotics long-term' },
  ],
  projects: [
    {
      slug: 'ohh-ave',
      title: '@ohhave',
      tags: JSON.stringify(['Personal Brand', 'Ongoing']),
      description:
        'Building in public as a young founder. Content about building, running, and the chaos of doing too many things at once. Real, unfiltered — growing an audience of people who are actually doing things.',
      image: '',
      link: 'https://instagram.com',
      year: '2024—now',
    },
    {
      slug: 'unseen',
      title: 'Unseen',
      tags: JSON.stringify(['AI Engine', 'Next.js', 'Problem-first']),
      description:
        'Built around a real problem — people do impressive things and have no way to prove them. Describe a real experience and Unseen extracts the skills, scores how strongly the story proves each one, and turns it into resume bullets and LinkedIn blurbs. Evidence, not flattery.',
      image: '',
      link: '',
      year: '2025',
    },
    {
      slug: 'arduino',
      title: 'Arduino + Microcontrollers',
      tags: JSON.stringify(['Hardware', 'Learning']),
      description:
        'Working through embedded systems, C/C++, and microcontroller fundamentals. The long-term direction is robotics — the goal is to eventually build things you can actually hold.',
      image: '',
      link: '',
      year: '2026',
    },
  ],
  achievements: [
    {
      year: '2025 · Athletics',
      title: '21km Half Marathon',
      description:
        'Completed at 15. Proof of discipline, pain tolerance, and long-term commitment to something hard.',
    },
    {
      year: '2025 · Business',
      title: 'First Website Sold',
      description:
        'Built and sold a single-page website to a local business. Handled everything — outreach, proposal, build, delivery.',
    },
    {
      year: '2026 · Startup',
      title: 'Built a 5-Person Team',
      description:
        'Assembled a full product team from scratch — designer, developer, and more. All sourced independently.',
    },
    {
      year: '2024-25 · Comms',
      title: 'MUN — Best Delegation',
      description: 'Best Delegation and Special Mentions at regional MUNs. Started debating young.',
    },
    {
      year: '2024-26 · Leadership',
      title: 'Events Lead · 500+ Attendees',
      description: 'Lead coordinator for school events. End-to-end event management for the whole community.',
    },
  ],
  contentItems: [
    {
      platform: 'Instagram',
      name: '@ohhave',
      description:
        'Building in public. The chaos of being a young founder — exams, product sprints, content, all at once.',
      url: 'https://instagram.com',
      linkText: 'Follow ↗',
    },
    {
      platform: 'Twitter / X',
      name: '@avebuilds',
      description: 'Daily updates from the build. What shipped, what broke, what I learned.',
      url: 'https://x.com',
      linkText: 'Follow ↗',
    },
    {
      platform: 'YouTube',
      name: '@avebuilds',
      description: 'Long-form story — the full picture of what building something looks like.',
      url: 'https://youtube.com',
      linkText: 'Subscribe ↗',
    },
  ],
  contactLinks: [
    { label: 'Email', value: 'hello@averyquinn.com', url: 'mailto:hello@averyquinn.com' },
    { label: 'Instagram', value: '@ohhave', url: 'https://instagram.com' },
    { label: 'Twitter / X', value: '@avebuilds', url: 'https://x.com' },
    { label: 'YouTube', value: '@avebuilds', url: 'https://youtube.com' },
    { label: 'Phone', value: '+1 555 0100', url: 'tel:+15550100' },
  ],
};

export function initSchema(db) {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA_SQL);
  seedIfEmpty(db);
}

export function seedIfEmpty(db) {
  const count = db.prepare('SELECT COUNT(*) AS n FROM site').get().n;
  if (count > 0) return;

  const insSite = db.prepare(
    'INSERT INTO site (id, name, tagline, statusText, copyright, navCtaText) VALUES (1, @name, @tagline, @statusText, @copyright, @navCtaText)'
  );
  const insHero = db.prepare(
    'INSERT INTO hero (id, kicker, nameLine1, nameLine2, note, subtitle, rotatingWords, statusText, email, starImage, floatNote, chips) VALUES (1, @kicker, @nameLine1, @nameLine2, @note, @subtitle, @rotatingWords, @statusText, @email, @starImage, @floatNote, @chips)'
  );
  const insAbout = db.prepare(
    'INSERT INTO about (id, kicker, title, paragraphs, accent) VALUES (1, @kicker, @title, @paragraphs, @accent)'
  );
  const insMarquee = db.prepare('INSERT INTO marquee (id, m1, m2) VALUES (1, @m1, @m2)');
  const insContact = db.prepare(
    'INSERT INTO contact (id, kicker, headlineBefore, headlineCircled, headlineAfter, body, ctaText, ctaUrl, email, copyText, featuredCtaText) VALUES (1, @kicker, @headlineBefore, @headlineCircled, @headlineAfter, @body, @ctaText, @ctaUrl, @email, @copyText, @featuredCtaText)'
  );
  const insStat = db.prepare('INSERT INTO stats (value, suffix, label, visible) VALUES (@value, @suffix, @label, 1)');
  const insCur = db.prepare(
    'INSERT INTO currently_items (text, sub, visible, "order") VALUES (@text, @sub, 1, @order)'
  );
  const insProj = db.prepare(
    'INSERT INTO projects (slug, title, tags, description, image, link, year, visible, "order") VALUES (@slug, @title, @tags, @description, @image, @link, @year, 1, @order)'
  );
  const insAch = db.prepare(
    'INSERT INTO achievements (year, title, description, visible, "order") VALUES (@year, @title, @description, 1, @order)'
  );
  const insContent = db.prepare(
    'INSERT INTO content_items (platform, name, description, url, linkText, visible, "order") VALUES (@platform, @name, @description, @url, @linkText, 1, @order)'
  );
  const insLink = db.prepare(
    'INSERT INTO contact_links (label, value, url, visible, "order") VALUES (@label, @value, @url, 1, @order)'
  );

  const tx = db.transaction(() => {
    insSite.run(SEED.site);
    insHero.run(SEED.hero);
    insAbout.run(SEED.about);
    insMarquee.run(SEED.marquee);
    insContact.run(SEED.contact);
    SEED.stats.forEach((r) => insStat.run(r));
    SEED.currently.forEach((r, i) => insCur.run({ ...r, order: i }));
    SEED.projects.forEach((r, i) => insProj.run({ ...r, order: i }));
    SEED.achievements.forEach((r, i) => insAch.run({ ...r, order: i }));
    SEED.contentItems.forEach((r, i) => insContent.run({ ...r, order: i }));
    SEED.contactLinks.forEach((r, i) => insLink.run({ ...r, order: i }));
  });
  tx();
}

// Helper to open the DB with schema initialised (used by scripts).
export function openDb() {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  initSchema(db);
  return db;
}
