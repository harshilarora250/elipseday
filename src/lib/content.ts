import { getSupabase } from './db';
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
const num = (v: unknown, d = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const str = (v: unknown, d = ''): string => (v == null ? d : String(v));
const boolDb = (v: unknown): boolean => (v === undefined || v === null ? true : !!v);

// camelCase (TS) -> snake_case (Postgres column) for update payloads.
const toSnake = (o: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) {
    out[k.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())] = v;
  }
  return out;
};

// ---------- row -> typed object mappers (snake_case -> camelCase) ----------
const toSite = (r: any): Site => ({
  id: r.id ?? 1,
  name: r.name ?? '',
  tagline: r.tagline ?? '',
  statusText: r.status_text ?? '',
  copyright: r.copyright ?? '',
  navCtaText: r.nav_cta_text ?? '',
});
const toHero = (r: any): Hero => ({
  id: r.id ?? 1,
  kicker: r.kicker ?? '',
  nameLine1: r.name_line1 ?? '',
  nameLine2: r.name_line2 ?? '',
  note: r.note ?? '',
  subtitle: r.subtitle ?? '',
  rotatingWords: r.rotating_words ?? '',
  statusText: r.status_text ?? '',
  email: r.email ?? '',
  starImage: r.star_image ?? '',
  floatNote: r.float_note ?? '',
  chips: r.chips ?? '[]',
});
const toAbout = (r: any): About => ({
  id: r.id ?? 1,
  kicker: r.kicker ?? '',
  title: r.title ?? '',
  paragraphs: r.paragraphs ?? '',
  accent: r.accent ?? '',
});
const toContact = (r: any): Contact => ({
  id: r.id ?? 1,
  kicker: r.kicker ?? '',
  headlineBefore: r.headline_before ?? '',
  headlineCircled: r.headline_circled ?? '',
  headlineAfter: r.headline_after ?? '',
  body: r.body ?? '',
  ctaText: r.cta_text ?? '',
  ctaUrl: r.cta_url ?? '',
  email: r.email ?? '',
  copyText: r.copy_text ?? '',
  featuredCtaText: r.featured_cta_text ?? '',
});
const toStat = (r: any): Stat => ({
  id: r.id,
  value: r.value,
  suffix: r.suffix,
  label: r.label,
  visible: !!r.visible,
  order: r.display_order ?? 0,
});
const toCurrently = (r: any): CurrentlyItem => ({
  id: r.id,
  text: r.text,
  sub: r.sub,
  visible: !!r.visible,
  order: r.display_order ?? 0,
});
const toProject = (r: any): Project => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  tags: r.tags,
  description: r.description,
  image: r.image,
  link: r.link,
  year: r.year,
  visible: !!r.visible,
  order: r.display_order ?? 0,
});
const toAchievement = (r: any): Achievement => ({
  id: r.id,
  year: r.year,
  title: r.title,
  description: r.description,
  visible: !!r.visible,
  order: r.display_order ?? 0,
});
const toContentItem = (r: any): ContentItem => ({
  id: r.id,
  platform: r.platform,
  name: r.name,
  description: r.description,
  url: r.url,
  linkText: r.link_text,
  visible: !!r.visible,
  order: r.display_order ?? 0,
});
const toContactLink = (r: any): ContactLink => ({
  id: r.id,
  label: r.label,
  value: r.value,
  url: r.url,
  visible: !!r.visible,
  order: r.display_order ?? 0,
});

// ---------- singletons ----------
export async function getSite(): Promise<Site> {
  const { data } = await getSupabase().from('site').select('*').eq('id', 1).maybeSingle();
  return toSite(data ?? {});
}
export async function getHero(): Promise<Hero> {
  const { data } = await getSupabase().from('hero').select('*').eq('id', 1).maybeSingle();
  return toHero(data ?? {});
}
export async function getAbout(): Promise<About> {
  const { data } = await getSupabase().from('about').select('*').eq('id', 1).maybeSingle();
  return toAbout(data ?? {});
}
export async function getContact(): Promise<Contact> {
  const { data } = await getSupabase().from('contact').select('*').eq('id', 1).maybeSingle();
  return toContact(data ?? {});
}
export async function getMarquee(): Promise<{ m1: string; m2: string }> {
  const { data } = await getSupabase().from('marquee').select('m1, m2').eq('id', 1).maybeSingle();
  return { m1: data?.m1 ?? '', m2: data?.m2 ?? '' };
}

// ---------- collections ----------
export async function getStats(includeHidden = false): Promise<Stat[]> {
  let q = getSupabase().from('stats').select('*');
  if (!includeHidden) q = q.eq('visible', true);
  // Order by display_order when available (supports admin reorder). Older
  // deployments may not have that column yet — fall back to id ordering so the
  // section still loads instead of erroring out to an empty list.
  const { data, error } = await q
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });
  if (error && /display_order/i.test(error.message)) {
    const fb = getSupabase().from('stats').select('*');
    if (!includeHidden) fb.eq('visible', true);
    const { data: d2 } = await fb.order('id', { ascending: true });
    return (d2 ?? []).map(toStat);
  }
  return (data ?? []).map(toStat);
}
export async function getCurrently(includeHidden = false): Promise<CurrentlyItem[]> {
  let q = getSupabase().from('currently_items').select('*');
  if (!includeHidden) q = q.eq('visible', true);
  const { data } = await q.order('display_order', { ascending: true }).order('id', { ascending: true });
  return (data ?? []).map(toCurrently);
}
export async function getProjects(includeHidden = false): Promise<Project[]> {
  let q = getSupabase().from('projects').select('*');
  if (!includeHidden) q = q.eq('visible', true);
  const { data } = await q.order('display_order', { ascending: true }).order('id', { ascending: true });
  return (data ?? []).map(toProject);
}
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const { data } = await getSupabase().from('projects').select('*').eq('slug', slug).maybeSingle();
  return data ? toProject(data) : undefined;
}
export async function getAchievements(includeHidden = false): Promise<Achievement[]> {
  let q = getSupabase().from('achievements').select('*');
  if (!includeHidden) q = q.eq('visible', true);
  const { data } = await q.order('display_order', { ascending: true }).order('id', { ascending: true });
  return (data ?? []).map(toAchievement);
}
export async function getContentItems(includeHidden = false): Promise<ContentItem[]> {
  let q = getSupabase().from('content_items').select('*');
  if (!includeHidden) q = q.eq('visible', true);
  const { data } = await q.order('display_order', { ascending: true }).order('id', { ascending: true });
  return (data ?? []).map(toContentItem);
}
export async function getContactLinks(includeHidden = false): Promise<ContactLink[]> {
  let q = getSupabase().from('contact_links').select('*');
  if (!includeHidden) q = q.eq('visible', true);
  const { data } = await q.order('display_order', { ascending: true }).order('id', { ascending: true });
  return (data ?? []).map(toContactLink);
}

// ---------- public aggregate ----------
export async function getPublicData(): Promise<PublicData> {
  const [site, hero, about, contact, marquee, stats, currently, projects, achievements, contentItems, contactLinks] =
    await Promise.all([
      getSite(),
      getHero(),
      getAbout(),
      getContact(),
      getMarquee(),
      getStats(false),
      getCurrently(false),
      getProjects(false),
      getAchievements(false),
      getContentItems(false),
      getContactLinks(false),
    ]);
  return {
    site,
    hero,
    about,
    stats,
    currently,
    projects,
    achievements,
    contentItems,
    contact,
    contactLinks,
    marquee1: marquee.m1.split(' / ').map((s) => s.trim()).filter(Boolean),
    marquee2: marquee.m2.split('✶').map((s) => s.trim()).filter(Boolean),
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

export async function getAdminData(): Promise<AdminData> {
  const [site, hero, about, contact, marquee, stats, currently, projects, achievements, contentItems, contactLinks] =
    await Promise.all([
      getSite(),
      getHero(),
      getAbout(),
      getContact(),
      getMarquee(),
      getStats(true),
      getCurrently(true),
      getProjects(true),
      getAchievements(true),
      getContentItems(true),
      getContactLinks(true),
    ]);
  return {
    site,
    hero,
    about,
    contact,
    marquee,
    stats,
    currently,
    projects,
    achievements,
    contentItems,
    contactLinks,
  };
}

// ---------- generic singleton update ----------
async function updateSingleton(table: string, patch: Record<string, unknown>) {
  const keys = Object.keys(patch).filter((k) => k !== 'id');
  if (keys.length === 0) return;
  const clean = toSnake(patch);
  await getSupabase().from(table).update(clean).eq('id', 1);
}

export const updateSite = (p: Record<string, unknown>) => updateSingleton('site', p);
export const updateHero = (p: Record<string, unknown>) => updateSingleton('hero', p);
export const updateAbout = (p: Record<string, unknown>) => updateSingleton('about', p);
export const updateContact = (p: Record<string, unknown>) => updateSingleton('contact', p);
export const updateMarquee = (p: Record<string, unknown>) => updateSingleton('marquee', p);

// ---------- next display_order for a collection ----------
async function nextOrder(table: string): Promise<number> {
  const { data } = await getSupabase()
    .from(table)
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1);
  return (data?.[0]?.display_order ?? -1) + 1;
}

// ---------- generic collection CRUD ----------
async function insertRow(table: string, payload: Record<string, unknown>): Promise<number> {
  const { data, error } = await getSupabase().from(table).insert(payload).select('id').single();
  if (error) throw new Error(error.message);
  return (data as { id: number }).id;
}
async function updateRow(table: string, payload: Record<string, unknown>, id: number) {
  const { error } = await getSupabase().from(table).update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}
async function deleteRow(table: string, id: number) {
  const { error } = await getSupabase().from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// stats
export const createStat = (v: Partial<Stat>) => insertRow('stats', {
  value: num(v.value),
  suffix: str(v.suffix),
  label: str(v.label),
  visible: boolDb(v.visible),
});
export const updateStat = (v: Stat) => updateRow('stats', {
  value: num(v.value),
  suffix: str(v.suffix),
  label: str(v.label),
  visible: boolDb(v.visible),
}, num(v.id));
export const deleteStat = (id: number) => deleteRow('stats', id);

// currently_items
export async function createCurrently(v: Partial<CurrentlyItem>): Promise<number> {
  const order = v.order != null ? num(v.order) : await nextOrder('currently_items');
  return insertRow('currently_items', {
    text: str(v.text),
    sub: str(v.sub),
    visible: boolDb(v.visible),
    display_order: order,
  });
}
export const updateCurrently = (v: CurrentlyItem) => updateRow('currently_items', {
  text: str(v.text),
  sub: str(v.sub),
  visible: boolDb(v.visible),
  display_order: num(v.order),
}, num(v.id));
export const deleteCurrently = (id: number) => deleteRow('currently_items', id);

// projects
export async function createProject(v: Partial<Project>): Promise<number> {
  const order = v.order != null ? num(v.order) : await nextOrder('projects');
  return insertRow('projects', {
    slug: str(v.slug),
    title: str(v.title),
    tags: str(v.tags, '[]'),
    description: str(v.description),
    image: str(v.image),
    link: str(v.link),
    year: str(v.year),
    visible: boolDb(v.visible),
    display_order: order,
  });
}
export const updateProject = (v: Project) => updateRow('projects', {
  slug: str(v.slug),
  title: str(v.title),
  tags: str(v.tags, '[]'),
  description: str(v.description),
  image: str(v.image),
  link: str(v.link),
  year: str(v.year),
  visible: boolDb(v.visible),
  display_order: num(v.order),
}, num(v.id));
export const deleteProject = (id: number) => deleteRow('projects', id);

// achievements
export async function createAchievement(v: Partial<Achievement>): Promise<number> {
  const order = v.order != null ? num(v.order) : await nextOrder('achievements');
  return insertRow('achievements', {
    year: str(v.year),
    title: str(v.title),
    description: str(v.description),
    visible: boolDb(v.visible),
    display_order: order,
  });
}
export const updateAchievement = (v: Achievement) => updateRow('achievements', {
  year: str(v.year),
  title: str(v.title),
  description: str(v.description),
  visible: boolDb(v.visible),
  display_order: num(v.order),
}, num(v.id));
export const deleteAchievement = (id: number) => deleteRow('achievements', id);

// content_items
export async function createContentItem(v: Partial<ContentItem>): Promise<number> {
  const order = v.order != null ? num(v.order) : await nextOrder('content_items');
  return insertRow('content_items', {
    platform: str(v.platform),
    name: str(v.name),
    description: str(v.description),
    url: str(v.url),
    link_text: str(v.linkText, 'Open ↗'),
    visible: boolDb(v.visible),
    display_order: order,
  });
}
export const updateContentItem = (v: ContentItem) => updateRow('content_items', {
  platform: str(v.platform),
  name: str(v.name),
  description: str(v.description),
  url: str(v.url),
  link_text: str(v.linkText, 'Open ↗'),
  visible: boolDb(v.visible),
  display_order: num(v.order),
}, num(v.id));
export const deleteContentItem = (id: number) => deleteRow('content_items', id);

// contact_links
export async function createContactLink(v: Partial<ContactLink>): Promise<number> {
  const order = v.order != null ? num(v.order) : await nextOrder('contact_links');
  return insertRow('contact_links', {
    label: str(v.label),
    value: str(v.value),
    url: str(v.url),
    visible: boolDb(v.visible),
    display_order: order,
  });
}
export const updateContactLink = (v: ContactLink) => updateRow('contact_links', {
  label: str(v.label),
  value: str(v.value),
  url: str(v.url),
  visible: boolDb(v.visible),
  display_order: num(v.order),
}, num(v.id));
export const deleteContactLink = (id: number) => deleteRow('contact_links', id);

// ---------- reorder ----------
const REORDER_TABLES: Record<string, string> = {
  stats: 'stats',
  projects: 'projects',
  achievements: 'achievements',
  content_items: 'content_items',
  contact_links: 'contact_links',
  currently_items: 'currently_items',
};

export async function reorder(collection: string, ids: number[]): Promise<boolean> {
  const table = REORDER_TABLES[collection];
  if (!table) return false;
  for (let i = 0; i < ids.length; i++) {
    const { error } = await getSupabase().from(table).update({ display_order: i }).eq('id', ids[i]);
    if (error) return false;
  }
  return true;
}
