import { db } from './db';
import type {
  Site,
  Hero,
  About,
  Contact,
  Stat,
  CurrentlyItem,
  Project,
  Achievement,
  ContentItem,
  ContactLink,
  PublicData,
} from './types';

// ---------- helpers ----------
const jp = <T>(s: string | null, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

const num = (v: unknown, d = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const str = (v: unknown, d = ''): string => (v == null ? d : String(v));
const boolToNum = (v: unknown): number => (v ? 1 : 0);

// ---------- singletons ----------
export function getSite(): Site {
  return db.prepare('SELECT * FROM site WHERE id = 1').get() as Site;
}
export function getHero(): Hero {
  return db.prepare('SELECT * FROM hero WHERE id = 1').get() as Hero;
}
export function getAbout(): About {
  return db.prepare('SELECT * FROM about WHERE id = 1').get() as About;
}
export function getContact(): Contact {
  return db.prepare('SELECT * FROM contact WHERE id = 1').get() as Contact;
}
export function getMarquee(): { m1: string; m2: string } {
  return db.prepare('SELECT m1, m2 FROM marquee WHERE id = 1').get() as {
    m1: string;
    m2: string;
  };
}

// ---------- collections ----------
export function getStats(includeHidden = false): Stat[] {
  const sql = includeHidden
    ? 'SELECT * FROM stats ORDER BY id'
    : 'SELECT * FROM stats WHERE visible = 1 ORDER BY id';
  return db.prepare(sql).all() as Stat[];
}
export function getCurrently(includeHidden = false): CurrentlyItem[] {
  const sql = includeHidden
    ? 'SELECT * FROM currently_items ORDER BY "order", id'
    : 'SELECT * FROM currently_items WHERE visible = 1 ORDER BY "order", id';
  return db.prepare(sql).all() as CurrentlyItem[];
}
export function getProjects(includeHidden = false): Project[] {
  const sql = includeHidden
    ? 'SELECT * FROM projects ORDER BY "order", id'
    : 'SELECT * FROM projects WHERE visible = 1 ORDER BY "order", id';
  return db.prepare(sql).all() as Project[];
}
export function getProjectBySlug(slug: string): Project | undefined {
  return db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug) as
    | Project
    | undefined;
}
export function getAchievements(includeHidden = false): Achievement[] {
  const sql = includeHidden
    ? 'SELECT * FROM achievements ORDER BY "order", id'
    : 'SELECT * FROM achievements WHERE visible = 1 ORDER BY "order", id';
  return db.prepare(sql).all() as Achievement[];
}
export function getContentItems(includeHidden = false): ContentItem[] {
  const sql = includeHidden
    ? 'SELECT * FROM content_items ORDER BY "order", id'
    : 'SELECT * FROM content_items WHERE visible = 1 ORDER BY "order", id';
  return db.prepare(sql).all() as ContentItem[];
}
export function getContactLinks(includeHidden = false): ContactLink[] {
  const sql = includeHidden
    ? 'SELECT * FROM contact_links ORDER BY "order", id'
    : 'SELECT * FROM contact_links WHERE visible = 1 ORDER BY "order", id';
  return db.prepare(sql).all() as ContactLink[];
}

// ---------- public aggregate ----------
export function getPublicData(): PublicData {
  return {
    site: getSite(),
    hero: getHero(),
    about: getAbout(),
    stats: getStats(false),
    currently: getCurrently(false),
    projects: getProjects(false),
    achievements: getAchievements(false),
    contentItems: getContentItems(false),
    contact: getContact(),
    contactLinks: getContactLinks(false),
    marquee1: getMarquee().m1.split(' / ').map((s) => s.trim()).filter(Boolean),
    marquee2: getMarquee().m2.split('✶').map((s) => s.trim()).filter(Boolean),
  };
}

// ---------- admin aggregate ----------
export interface AdminData {
  site: Site;
  hero: Hero;
  about: About;
  contact: Contact;
  marquee: { m1: string; m2: string };
  stats: Stat[];
  currently: CurrentlyItem[];
  projects: Project[];
  achievements: Achievement[];
  contentItems: ContentItem[];
  contactLinks: ContactLink[];
}

export function getAdminData(): AdminData {
  return {
    site: getSite(),
    hero: getHero(),
    about: getAbout(),
    contact: getContact(),
    marquee: getMarquee(),
    stats: getStats(true),
    currently: getCurrently(true),
    projects: getProjects(true),
    achievements: getAchievements(true),
    contentItems: getContentItems(true),
    contactLinks: getContactLinks(true),
  };
}

// ---------- generic singleton update ----------
function updateSingleton(table: string, patch: Record<string, unknown>) {
  const keys = Object.keys(patch).filter((k) => k !== 'id');
  if (keys.length === 0) return;
  const set = keys.map((k) => `"${k}" = @${k}`).join(', ');
  const sql = `UPDATE ${table} SET ${set} WHERE id = 1`;
  db.prepare(sql).run(patch);
}

export const updateSite = (p: Record<string, unknown>) => updateSingleton('site', p);
export const updateHero = (p: Record<string, unknown>) => updateSingleton('hero', p);
export const updateAbout = (p: Record<string, unknown>) => updateSingleton('about', p);
export const updateContact = (p: Record<string, unknown>) => updateSingleton('contact', p);
export const updateMarquee = (p: Record<string, unknown>) => updateSingleton('marquee', p);

// ---------- generic collection CRUD ----------
function insertRow(table: string, cols: string[], row: Record<string, unknown>) {
  const cols2 = cols.map((c) => `"${c}"`).join(', ');
  const ph = cols.map((c) => `@${c}`).join(', ');
  const info = db
    .prepare(`INSERT INTO ${table} (${cols2}) VALUES (${ph})`)
    .run(row);
  return Number(info.lastInsertRowid);
}
function updateRow(table: string, cols: string[], row: Record<string, unknown>) {
  const set = cols.map((c) => `"${c}" = @${c}`).join(', ');
  db.prepare(`UPDATE ${table} SET ${set} WHERE id = @id`).run(row);
}
function deleteRow(table: string, id: number) {
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
}

// stats
export const createStat = (v: Partial<Stat>) =>
  insertRow('stats', ['value', 'suffix', 'label', 'visible'], {
    value: num(v.value),
    suffix: str(v.suffix),
    label: str(v.label),
    visible: boolToNum(v.visible ?? true),
  });
export const updateStat = (v: Stat) =>
  updateRow('stats', ['value', 'suffix', 'label', 'visible'], {
    id: num(v.id),
    value: num(v.value),
    suffix: str(v.suffix),
    label: str(v.label),
    visible: boolToNum(v.visible),
  });
export const deleteStat = (id: number) => deleteRow('stats', id);

// currently_items
export const createCurrently = (v: Partial<CurrentlyItem>) => {
  const max = (db.prepare('SELECT MAX("order") AS m FROM currently_items').get() as { m: number | null })
    .m;
  return insertRow('currently_items', ['text', 'sub', 'visible', 'order'], {
    text: str(v.text),
    sub: str(v.sub),
    visible: boolToNum(v.visible ?? true),
    order: max == null ? 0 : max + 1,
  });
};
export const updateCurrently = (v: CurrentlyItem) =>
  updateRow('currently_items', ['text', 'sub', 'visible', 'order'], {
    id: num(v.id),
    text: str(v.text),
    sub: str(v.sub),
    visible: boolToNum(v.visible),
    order: num(v.order),
  });
export const deleteCurrently = (id: number) => deleteRow('currently_items', id);

// projects
export const createProject = (v: Partial<Project>) =>
  insertRow(
    'projects',
    ['slug', 'title', 'tags', 'description', 'image', 'link', 'year', 'visible', 'order'],
    {
      slug: str(v.slug),
      title: str(v.title),
      tags: str(v.tags, '[]'),
      description: str(v.description),
      image: str(v.image),
      link: str(v.link),
      year: str(v.year),
      visible: boolToNum(v.visible ?? true),
      order: num(v.order),
    }
  );
export const updateProject = (v: Project) =>
  updateRow(
    'projects',
    ['slug', 'title', 'tags', 'description', 'image', 'link', 'year', 'visible', 'order'],
    {
      id: num(v.id),
      slug: str(v.slug),
      title: str(v.title),
      tags: str(v.tags, '[]'),
      description: str(v.description),
      image: str(v.image),
      link: str(v.link),
      year: str(v.year),
      visible: boolToNum(v.visible),
      order: num(v.order),
    }
  );
export const deleteProject = (id: number) => deleteRow('projects', id);

// achievements
export const createAchievement = (v: Partial<Achievement>) =>
  insertRow('achievements', ['year', 'title', 'description', 'visible', 'order'], {
    year: str(v.year),
    title: str(v.title),
    description: str(v.description),
    visible: boolToNum(v.visible ?? true),
    order: num(v.order),
  });
export const updateAchievement = (v: Achievement) =>
  updateRow('achievements', ['year', 'title', 'description', 'visible', 'order'], {
    id: num(v.id),
    year: str(v.year),
    title: str(v.title),
    description: str(v.description),
    visible: boolToNum(v.visible),
    order: num(v.order),
  });
export const deleteAchievement = (id: number) => deleteRow('achievements', id);

// content_items
export const createContentItem = (v: Partial<ContentItem>) =>
  insertRow(
    'content_items',
    ['platform', 'name', 'description', 'url', 'linkText', 'visible', 'order'],
    {
      platform: str(v.platform),
      name: str(v.name),
      description: str(v.description),
      url: str(v.url),
      linkText: str(v.linkText),
      visible: boolToNum(v.visible ?? true),
      order: num(v.order),
    }
  );
export const updateContentItem = (v: ContentItem) =>
  updateRow(
    'content_items',
    ['platform', 'name', 'description', 'url', 'linkText', 'visible', 'order'],
    {
      id: num(v.id),
      platform: str(v.platform),
      name: str(v.name),
      description: str(v.description),
      url: str(v.url),
      linkText: str(v.linkText),
      visible: boolToNum(v.visible),
      order: num(v.order),
    }
  );
export const deleteContentItem = (id: number) => deleteRow('content_items', id);

// contact_links
export const createContactLink = (v: Partial<ContactLink>) =>
  insertRow('contact_links', ['label', 'value', 'url', 'visible', 'order'], {
    label: str(v.label),
    value: str(v.value),
    url: str(v.url),
    visible: boolToNum(v.visible ?? true),
    order: num(v.order),
  });
export const updateContactLink = (v: ContactLink) =>
  updateRow('contact_links', ['label', 'value', 'url', 'visible', 'order'], {
    id: num(v.id),
    label: str(v.label),
    value: str(v.value),
    url: str(v.url),
    visible: boolToNum(v.visible),
    order: num(v.order),
  });
export const deleteContactLink = (id: number) => deleteRow('contact_links', id);

// ---------- reorder ----------
const REORDER_TABLES: Record<string, string> = {
  projects: 'projects',
  achievements: 'achievements',
  content_items: 'content_items',
  contact_links: 'contact_links',
  currently_items: 'currently_items',
};

export function reorder(collection: string, ids: number[]): boolean {
  const table = REORDER_TABLES[collection];
  if (!table) return false;
  const stmt = db.prepare(`UPDATE ${table} SET "order" = ? WHERE id = ?`);
  const tx = db.transaction((list: number[]) => {
    list.forEach((id, i) => stmt.run(i, id));
  });
  tx(ids);
  return true;
}
