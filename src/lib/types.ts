// Shared content types for the portfolio ORM-less data layer.

export type ChipColor = 'yellow' | 'mint' | 'pink' | 'coral' | 'lavender';

export interface Site {
  id: number;
  name: string;
  tagline: string;
  statusText: string;
  copyright: string;
  navCtaText: string;
}

export interface Hero {
  id: number;
  kicker: string;
  nameLine1: string;
  nameLine2: string;
  note: string;
  subtitle: string;
  rotatingWords: string; // newline-separated; rendered in the kinetic box
  statusText: string;
  email: string;
  starImage: string; // url
  floatNote: string;
  chips: string; // JSON array of { text, color }
}

export interface About {
  id: number;
  kicker: string;
  title: string;
  paragraphs: string; // newline-separated; use [[text]] for highlighted chips
  accent: string; // big Caveat note
}

export interface Stat {
  id: number;
  value: number;
  suffix: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface CurrentlyItem {
  id: number;
  text: string;
  sub: string;
  visible: boolean;
  order: number;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  tags: string; // JSON array
  description: string;
  image: string; // url (may be empty)
  link: string; // optional external link
  year: string;
  visible: boolean;
  order: number;
}

export interface Achievement {
  id: number;
  year: string;
  title: string;
  description: string;
  visible: boolean;
  order: number;
}

export interface ContentItem {
  id: number;
  platform: string;
  name: string;
  description: string;
  url: string;
  linkText: string;
  visible: boolean;
  order: number;
}

export interface ContactLink {
  id: number;
  label: string;
  value: string;
  url: string;
  visible: boolean;
  order: number;
}

export interface Contact {
  id: number;
  kicker: string;
  headlineBefore: string;
  headlineCircled: string;
  headlineAfter: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  email: string;
  copyText: string;
  featuredCtaText: string;
}

export interface Marquees {
  m1: string; // newline/pipe separated
  m2: string;
}

// Shapes used by the admin client (parsed JSON fields).
export interface Chip {
  text: string;
  color: ChipColor;
}

export interface PublicData {
  site: Site;
  hero: Hero;
  about: About;
  stats: Stat[];
  currently: CurrentlyItem[];
  projects: Project[];
  achievements: Achievement[];
  contentItems: ContentItem[];
  contact: Contact;
  contactLinks: ContactLink[];
  marquee1: string[];
  marquee2: string[];
}
