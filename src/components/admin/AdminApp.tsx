'use client';

import { useMemo, useState } from 'react';
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
} from '@/lib/types';
import { apiPut, apiPost, apiDelete } from './admin-api';
import { Field, TextArea, Toggle, ChipEditor, ImageField } from './ui';

interface AdminData {
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

type Tab =
  | 'site'
  | 'hero'
  | 'marquee'
  | 'about'
  | 'stats'
  | 'currently'
  | 'projects'
  | 'achievements'
  | 'content'
  | 'contactLinks';

const TABS: { id: Tab; label: string }[] = [
  { id: 'site', label: 'Site / Brand' },
  { id: 'hero', label: 'Hero' },
  { id: 'marquee', label: 'Marquees' },
  { id: 'about', label: 'About' },
  { id: 'stats', label: 'Stats' },
  { id: 'currently', label: 'Currently' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Wins' },
  { id: 'content', label: 'Content' },
  { id: 'contactLinks', label: 'Contact Links' },
];

function parseTags(raw: unknown): string[] {
  if (typeof raw === 'string') {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? (raw as string[]) : [];
}

let TMP = -1;
const tmpId = () => TMP--;

export default function AdminApp({ initial }: { initial: AdminData }) {
  const [data, setData] = useState<AdminData>(initial);
  const [saved, setSaved] = useState<AdminData>(initial);
  const [tab, setTab] = useState<Tab>('site');
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const dirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(saved),
    [data, saved]
  );

  const update = (section: keyof AdminData, patch: Record<string, unknown>) => {
    setData((d) => ({ ...d, [section]: { ...(d[section] as object), ...patch } }));
  };

  const setCollection = (
    key: 'stats' | 'currently' | 'projects' | 'achievements' | 'contentItems' | 'contactLinks',
    items: unknown[]
  ) => {
    setData((d) => ({ ...d, [key]: items }));
  };

  // ---------- SAVE ----------
  const save = async () => {
    setBusy(true);
    setMsg('');
    try {
      const fresh: Partial<AdminData> = {};
      // singletons
      if (data.site !== saved.site) await apiPut('/api/site', data.site);
      if (data.hero !== saved.hero) await apiPut('/api/hero', data.hero);
      if (data.about !== saved.about) await apiPut('/api/about', data.about);
      if (data.contact !== saved.contact) await apiPut('/api/contact', data.contact);
      if (data.marquee !== saved.marquee) await apiPut('/api/marquee', data.marquee);

      const put = await saveCollection('stats', '/api/stats', 'stats');
      if (put) fresh.stats = put;
      const cur = await saveCollection('currently', '/api/currently', 'currently');
      if (cur) fresh.currently = cur;
      const proj = await saveCollection('projects', '/api/projects', 'projects');
      if (proj) fresh.projects = proj;
      const ach = await saveCollection('achievements', '/api/achievements', 'achievements');
      if (ach) fresh.achievements = ach;
      const con = await saveCollection('contentItems', '/api/content-items', 'contentItems');
      if (con) fresh.contentItems = con;
      const lnk = await saveCollection('contactLinks', '/api/contact-links', 'contactLinks');
      if (lnk) fresh.contactLinks = lnk;

      setData((d) => ({ ...d, ...fresh }));
      setSaved((d) => ({ ...d, ...fresh }));
      setMsg('Saved ✓');
      setPreviewKey((k) => k + 1);
      setTimeout(() => setMsg(''), 2500);
    } catch (e) {
      setMsg('Error: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  async function saveCollection(
    key: 'stats' | 'currently' | 'projects' | 'achievements' | 'contentItems' | 'contactLinks',
    base: string,
    responseKey: keyof AdminData
  ): Promise<any[] | null> {
    const cur = data[key] as { id?: number }[];
    const old = saved[key] as { id?: number }[];
    const oldIds = new Set(old.map((o) => o.id));
    const curIds = new Set(cur.map((c) => c.id));

    // creates
    for (const item of cur) {
      if (item.id == null || item.id < 0) {
        const { id, ...rest } = item as { id?: number };
        void id;
        const res = await apiPost(base, stripInternal(rest));
        const newId = (res as { id: number }).id;
        setData((d) => ({
          ...d,
          [key]: (d[key] as { id?: number }[]).map((c) =>
            c === item ? { ...c, id: newId } : c
          ),
        }));
      }
    }
    // deletes
    for (const id of oldIds) {
      if (!curIds.has(id)) {
        await apiDelete(`${base}/${id}`);
      }
    }
    // updates (existing items: put all, backend upserts by id)
    for (const item of cur) {
      if (item.id != null && item.id > 0) {
        await apiPut(`${base}/${item.id}`, stripInternal(item));
      }
    }
    // reorder
    const collMap: Record<string, string> = {
      stats: 'stats',
      currently: 'currently_items',
      projects: 'projects',
      achievements: 'achievements',
      contentItems: 'content_items',
      contactLinks: 'contact_links',
    };
    const curSeq = cur
      .filter((c) => c.id != null && c.id > 0)
      .map((c) => c.id as number);
    const oldSeq = old
      .filter((c) => c.id != null && c.id > 0)
      .map((c) => c.id as number);
    if (JSON.stringify(curSeq) !== JSON.stringify(oldSeq) && curSeq.length) {
      await apiPut('/api/reorder', { collection: collMap[key], ids: curSeq });
    }
    // refresh from server response (each PUT returns the latest collection)
    const last = cur.find((c) => c.id != null && c.id > 0);
    if (last) {
      const res = await apiPut(`${base}/${last.id}`, stripInternal(last));
      const arr = (res as Record<string, unknown>)[responseKey];
      if (Array.isArray(arr)) return arr as unknown[];
    }
    return null;
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin';
  };

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          ADMIN<em>·</em>
        </div>
        <div className="admin-sub">content control</div>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`admin-nav-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <div className="admin-side-foot">
          <a className="admin-link" href="/" target="_blank" rel="noopener">
            ↗ View live site
          </a>
          <button className="admin-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-header">
          <h1 className="admin-h1">{TABS.find((t) => t.id === tab)?.label}</h1>
          <div className="admin-actions">
            {dirty ? (
              <span className="unsaved-flag">● unsaved</span>
            ) : (
              <span className="saved-flag">✓ all saved</span>
            )}
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={busy || !dirty}
            >
              {busy ? 'Saving…' : 'Save changes'}
            </button>
            <button className="btn btn-ghost" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? 'Hide preview' : 'Show preview'}
            </button>
          </div>
        </div>

        {msg && <div className="status-banner">{msg}</div>}

        {showPreview && (
          <div className="field" style={{ marginBottom: '1.5rem' }}>
            <div className="field-label">Live preview (saved state)</div>
            <iframe
              key={previewKey}
              src="/preview"
              title="Live preview"
              style={{
                width: '100%',
                height: '70vh',
                border: '2.5px solid var(--dark)',
                background: 'var(--cream)',
              }}
            />
          </div>
        )}

        {tab === 'site' && (
          <SiteEditor site={data.site} update={(p) => update('site', p)} />
        )}
        {tab === 'hero' && (
          <HeroEditor hero={data.hero} update={(p) => update('hero', p)} />
        )}
        {tab === 'marquee' && (
          <MarqueeEditor m={data.marquee} update={(p) => update('marquee', p)} />
        )}
        {tab === 'about' && (
          <AboutEditor about={data.about} update={(p) => update('about', p)} />
        )}
        {tab === 'stats' && (
          <StatsEditor
            items={data.stats}
            set={(v) => setCollection('stats', v)}
          />
        )}
        {tab === 'currently' && (
          <CurrentlyEditor
            items={data.currently}
            set={(v) => setCollection('currently', v)}
          />
        )}
        {tab === 'projects' && (
          <ProjectsEditor
            items={data.projects}
            set={(v) => setCollection('projects', v)}
          />
        )}
        {tab === 'achievements' && (
          <AchievementsEditor
            items={data.achievements}
            set={(v) => setCollection('achievements', v)}
          />
        )}
        {tab === 'content' && (
          <ContentEditor
            items={data.contentItems}
            set={(v) => setCollection('contentItems', v)}
          />
        )}
        {tab === 'contactLinks' && (
          <ContactLinksEditor
            items={data.contactLinks}
            set={(v) => setCollection('contactLinks', v)}
          />
        )}
      </div>
    </div>
  );
}

// strip temporary client-only fields (none currently, but keep safe)
function stripInternal(item: Record<string, unknown>) {
  const { ...rest } = item;
  return rest;
}

// ============================ EDITORS ============================

function SiteEditor({
  site,
  update,
}: {
  site: Site;
  update: (p: Record<string, unknown>) => void;
}) {
  return (
    <div className="admin-section">
      <Field label="Name (used in footer)" value={site.name} onChange={(v) => update({ name: v })} />
      <TextArea label="Tagline" value={site.tagline} onChange={(v) => update({ tagline: v })} />
      <Field label="Status text (nav + footer)" value={site.statusText} onChange={(v) => update({ statusText: v })} />
      <Field label="Nav CTA text" value={site.navCtaText} onChange={(v) => update({ navCtaText: v })} />
      <Field label="Copyright" value={site.copyright} onChange={(v) => update({ copyright: v })} />
    </div>
  );
}

function HeroEditor({
  hero,
  update,
}: {
  hero: Hero;
  update: (p: Record<string, unknown>) => void;
}) {
  return (
    <div className="admin-section">
      <Field label="Kicker" value={hero.kicker} onChange={(v) => update({ kicker: v })} />
      <div className="admin-grid-2">
        <Field label="Name line 1" value={hero.nameLine1} onChange={(v) => update({ nameLine1: v })} />
        <Field label="Name line 2" value={hero.nameLine2} onChange={(v) => update({ nameLine2: v })} />
      </div>
      <Field label="Handwritten note" value={hero.note} onChange={(v) => update({ note: v })} />
      <TextArea label="Subtitle" value={hero.subtitle} onChange={(v) => update({ subtitle: v })} />
      <TextArea
        label="Rotating words (one per line)"
        value={hero.rotatingWords}
        onChange={(v) => update({ rotatingWords: v })}
        hint="Shown in the yellow kinetic box. One word per line."
      />
      <Field label="Float note (sticker)" value={hero.floatNote} onChange={(v) => update({ floatNote: v })} />
      <Field label="Status text" value={hero.statusText} onChange={(v) => update({ statusText: v })} />
      <Field label="Email" value={hero.email} onChange={(v) => update({ email: v })} />
      <ImageField label="Hero star image (optional URL)" value={hero.starImage} onChange={(v) => update({ starImage: v })} hint="Leave empty to use the default doodle star." />
      <ChipEditor value={hero.chips} onChange={(v) => update({ chips: v })} />
    </div>
  );
}

function MarqueeEditor({
  m,
  update,
}: {
  m: { m1: string; m2: string };
  update: (p: Record<string, unknown>) => void;
}) {
  const toLines = (s: string) => s.split('/').map((x) => x.trim()).filter(Boolean).join('\n');
  const fromLines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean).join(' / ');
  const [m1l, setM1l] = useState(toLines(m.m1));
  const [m2l, setM2l] = useState(m.m2.split('✶').map((x) => x.trim()).filter(Boolean).join('\n'));
  return (
    <div className="admin-section">
      <TextArea
        label="Marquee 1 (one per line, joined with /)"
        value={m1l}
        onChange={(v) => {
          setM1l(v);
          update({ m1: fromLines(v) });
        }}
      />
      <TextArea
        label="Marquee 2 (one per line, joined with ✶)"
        value={m2l}
        onChange={(v) => {
          setM2l(v);
          update({ m2: v.split('\n').map((x) => x.trim()).filter(Boolean).join(' ✶ ') });
        }}
      />
    </div>
  );
}

function AboutEditor({
  about,
  update,
}: {
  about: About;
  update: (p: Record<string, unknown>) => void;
}) {
  return (
    <div className="admin-section">
      <Field label="Kicker" value={about.kicker} onChange={(v) => update({ kicker: v })} />
      <Field label="Title" value={about.title} onChange={(v) => update({ title: v })} />
      <TextArea
        label="Paragraphs (one per line)"
        value={about.paragraphs}
        onChange={(v) => update({ paragraphs: v })}
        rows={8}
        hint="Wrap a phrase in [[double brackets]] to turn it into a highlight chip."
      />
      <Field label="Handwritten accent note" value={about.accent} onChange={(v) => update({ accent: v })} />
    </div>
  );
}

function CardShell({
  title,
  sub,
  visible,
  onToggle,
  onUp,
  onDown,
  onRemove,
  canUp,
  canDown,
  children,
}: {
  title: string;
  sub?: string;
  visible: boolean;
  onToggle: (v: boolean) => void;
  onUp?: () => void;
  onDown?: () => void;
  onRemove: () => void;
  canUp?: boolean;
  canDown?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`card-row${visible ? '' : ' hidden-entry'}`}>
      <div className="card-row-head">
        <div>
          <div className="card-row-title">{title}</div>
          {sub && <div className="card-row-sub">{sub}</div>}
        </div>
        <div className="card-row-tools">
          {onUp && (
            <button className="icon-btn" onClick={onUp} disabled={!canUp} aria-label="Move up">
              ↑
            </button>
          )}
          {onDown && (
            <button className="icon-btn" onClick={onDown} disabled={!canDown} aria-label="Move down">
              ↓
            </button>
          )}
          <Toggle label="" checked={visible} onChange={onToggle} />
          <button className="icon-btn del" onClick={onRemove} aria-label="Delete">
            ×
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function StatsEditor({
  items,
  set,
}: {
  items: Stat[];
  set: (v: Stat[]) => void;
}) {
  const change = (i: number, patch: Partial<Stat>) =>
    set(items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const add = () =>
    set([...items, { id: tmpId(), value: 0, suffix: '', label: 'New stat', visible: true }]);
  const remove = (i: number) => set(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
  };
  return (
    <div className="admin-section">
      <p className="field-hint" style={{ marginBottom: '1rem' }}>
        These animate with a count-up when scrolled into view.
      </p>
      <div className="card-list">
        {items.length === 0 && <div className="empty-state">No stats yet — add one ↓</div>}
        {items.map((s, i) => (
          <CardShell
            key={s.id ?? i}
            title={s.label || 'Stat'}
            sub={`value: ${s.value}${s.suffix}`}
            visible={!!s.visible}
            onToggle={(v) => change(i, { visible: v })}
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            canUp={i > 0}
            canDown={i < items.length - 1}
            onRemove={() => remove(i)}
          >
            <div className="admin-grid-2">
              <Field label="Value (number)" value={String(s.value)} onChange={(v) => change(i, { value: Number(v) || 0 })} />
              <Field label="Suffix (e.g. +)" value={s.suffix} onChange={(v) => change(i, { suffix: v })} />
            </div>
            <Field label="Label" value={s.label} onChange={(v) => change(i, { label: v })} />
          </CardShell>
        ))}
      </div>
      <button className="btn btn-mint" style={{ marginTop: '1rem' }} onClick={add}>
        + Add stat
      </button>
    </div>
  );
}

function CurrentlyEditor({
  items,
  set,
}: {
  items: CurrentlyItem[];
  set: (v: CurrentlyItem[]) => void;
}) {
  const change = (i: number, patch: Partial<CurrentlyItem>) =>
    set(items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const add = () =>
    set([...items, { id: tmpId(), text: 'New item', sub: '', visible: true, order: items.length }]);
  const remove = (i: number) => set(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((it, idx) => (it.order = idx));
    set(next);
  };
  return (
    <div className="admin-section">
      <div className="card-list">
        {items.length === 0 && <div className="empty-state">Nothing here yet — add one ↓</div>}
        {items.map((s, i) => (
          <CardShell
            key={s.id ?? i}
            title={s.text || 'Item'}
            sub={s.sub}
            visible={!!s.visible}
            onToggle={(v) => change(i, { visible: v })}
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            canUp={i > 0}
            canDown={i < items.length - 1}
            onRemove={() => remove(i)}
          >
            <Field label="Text" value={s.text} onChange={(v) => change(i, { text: v })} />
            <Field label="Sub-label" value={s.sub} onChange={(v) => change(i, { sub: v })} />
          </CardShell>
        ))}
      </div>
      <button className="btn btn-mint" style={{ marginTop: '1rem' }} onClick={add}>
        + Add item
      </button>
    </div>
  );
}

function ProjectsEditor({
  items,
  set,
}: {
  items: Project[];
  set: (v: Project[]) => void;
}) {
  const change = (i: number, patch: Partial<Project>) =>
    set(items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const add = () =>
    set([
      ...items,
      {
        id: tmpId(),
        slug: '',
        title: 'New project',
        tags: '[]',
        description: '',
        image: '',
        link: '',
        year: '',
        visible: true,
        order: items.length,
      },
    ]);
  const remove = (i: number) => set(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((it, idx) => (it.order = idx));
    set(next);
  };
  return (
    <div className="admin-section">
      <div className="card-list">
        {items.length === 0 && <div className="empty-state">No projects — add your first ↓</div>}
        {items.map((p, i) => {
          const tags = parseTags(p.tags);
          return (
            <CardShell
              key={p.id ?? i}
              title={p.title || 'Project'}
              sub={p.year}
              visible={!!p.visible}
            onToggle={(v) => change(i, { visible: v })}
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
              canUp={i > 0}
              canDown={i < items.length - 1}
              onRemove={() => remove(i)}
            >
              <Field label="Title" value={p.title} onChange={(v) => change(i, { title: v })} />
              <div className="admin-grid-2">
                <Field label="Slug (URL)" value={p.slug} onChange={(v) => change(i, { slug: v })} hint="Used at /projects/your-slug" />
                <Field label="Year / meta" value={p.year} onChange={(v) => change(i, { year: v })} />
              </div>
              <Field
                label="Tags (comma separated)"
                value={tags.join(', ')}
                onChange={(v) =>
                  change(i, {
                    tags: JSON.stringify(
                      v.split(',').map((t) => t.trim()).filter(Boolean)
                    ),
                  })
                }
              />
              <TextArea label="Description" value={p.description} onChange={(v) => change(i, { description: v })} rows={5} />
              <ImageField label="Image URL" value={p.image} onChange={(v) => change(i, { image: v })} />
              <Field label="External link (optional)" value={p.link} onChange={(v) => change(i, { link: v })} />
            </CardShell>
          );
        })}
      </div>
      <button className="btn btn-mint" style={{ marginTop: '1rem' }} onClick={add}>
        + Add project
      </button>
    </div>
  );
}

function AchievementsEditor({
  items,
  set,
}: {
  items: Achievement[];
  set: (v: Achievement[]) => void;
}) {
  const change = (i: number, patch: Partial<Achievement>) =>
    set(items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const add = () =>
    set([...items, { id: tmpId(), year: '', title: 'New win', description: '', visible: true, order: items.length }]);
  const remove = (i: number) => set(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((it, idx) => (it.order = idx));
    set(next);
  };
  return (
    <div className="admin-section">
      <div className="card-list">
        {items.length === 0 && <div className="empty-state">No wins yet — add one ↓</div>}
        {items.map((a, i) => (
          <CardShell
            key={a.id ?? i}
            title={a.title || 'Win'}
            sub={a.year}
            visible={!!a.visible}
            onToggle={(v) => change(i, { visible: v })}
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            canUp={i > 0}
            canDown={i < items.length - 1}
            onRemove={() => remove(i)}
          >
            <Field label="Year / category" value={a.year} onChange={(v) => change(i, { year: v })} />
            <Field label="Title" value={a.title} onChange={(v) => change(i, { title: v })} />
            <TextArea label="Description" value={a.description} onChange={(v) => change(i, { description: v })} rows={4} />
          </CardShell>
        ))}
      </div>
      <button className="btn btn-mint" style={{ marginTop: '1rem' }} onClick={add}>
        + Add win
      </button>
    </div>
  );
}

function ContentEditor({
  items,
  set,
}: {
  items: ContentItem[];
  set: (v: ContentItem[]) => void;
}) {
  const change = (i: number, patch: Partial<ContentItem>) =>
    set(items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const add = () =>
    set([
      ...items,
      { id: tmpId(), platform: 'Platform', name: 'Handle', description: '', url: '', linkText: 'Open ↗', visible: true, order: items.length },
    ]);
  const remove = (i: number) => set(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((it, idx) => (it.order = idx));
    set(next);
  };
  return (
    <div className="admin-section">
      <div className="card-list">
        {items.length === 0 && <div className="empty-state">No content rows — add one ↓</div>}
        {items.map((c, i) => (
          <CardShell
            key={c.id ?? i}
            title={c.name || 'Row'}
            sub={c.platform}
            visible={!!c.visible}
            onToggle={(v) => change(i, { visible: v })}
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            canUp={i > 0}
            canDown={i < items.length - 1}
            onRemove={() => remove(i)}
          >
            <div className="admin-grid-2">
              <Field label="Platform" value={c.platform} onChange={(v) => change(i, { platform: v })} />
              <Field label="Name / handle" value={c.name} onChange={(v) => change(i, { name: v })} />
            </div>
            <TextArea label="Description" value={c.description} onChange={(v) => change(i, { description: v })} rows={3} />
            <div className="admin-grid-2">
              <Field label="URL" value={c.url} onChange={(v) => change(i, { url: v })} />
              <Field label="Link text" value={c.linkText} onChange={(v) => change(i, { linkText: v })} />
            </div>
          </CardShell>
        ))}
      </div>
      <button className="btn btn-mint" style={{ marginTop: '1rem' }} onClick={add}>
        + Add row
      </button>
    </div>
  );
}

function ContactLinksEditor({
  items,
  set,
}: {
  items: ContactLink[];
  set: (v: ContactLink[]) => void;
}) {
  const change = (i: number, patch: Partial<ContactLink>) =>
    set(items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const add = () =>
    set([...items, { id: tmpId(), label: 'Label', value: '', url: '', visible: true, order: items.length }]);
  const remove = (i: number) => set(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((it, idx) => (it.order = idx));
    set(next);
  };
  return (
    <div className="admin-section">
      <div className="card-list">
        {items.length === 0 && <div className="empty-state">No links — add one ↓</div>}
        {items.map((l, i) => (
          <CardShell
            key={l.id ?? i}
            title={l.label || 'Link'}
            sub={l.value}
            visible={!!l.visible}
            onToggle={(v) => change(i, { visible: v })}
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            canUp={i > 0}
            canDown={i < items.length - 1}
            onRemove={() => remove(i)}
          >
            <div className="admin-grid-2">
              <Field label="Label" value={l.label} onChange={(v) => change(i, { label: v })} />
              <Field label="Display value" value={l.value} onChange={(v) => change(i, { value: v })} />
            </div>
            <Field label="URL" value={l.url} onChange={(v) => change(i, { url: v })} />
          </CardShell>
        ))}
      </div>
      <button className="btn btn-mint" style={{ marginTop: '1rem' }} onClick={add}>
        + Add link
      </button>
    </div>
  );
}
