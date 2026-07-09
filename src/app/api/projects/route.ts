import { requireAuth, ok, bad, readJson } from '@/lib/api';
import {
  createProject,
  getProjects,
} from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `item-${Date.now()}`
  );
}

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');
  if (!String(body.title ?? '').trim()) return bad('Title is required');
  const tags =
    typeof body.tags === 'string'
      ? body.tags
      : JSON.stringify(Array.isArray(body.tags) ? body.tags : []);
  const id = createProject({
    slug: String(body.slug ?? '').trim() || slugify(String(body.title)),
    title: String(body.title),
    tags,
    description: String(body.description ?? ''),
    image: String(body.image ?? ''),
    link: String(body.link ?? ''),
    year: String(body.year ?? ''),
    visible: body.visible !== false,
  });
  return ok({ id, projects: getProjects(true) });
}
