import { requireAuth, ok, bad, readJson } from '@/lib/api';
import {
  updateProject,
  deleteProject,
  getProjects,
} from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAuth();
  if (guard) return guard;
  const id = Number((await params).id);
  if (!id) return bad('Missing id');
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');
  const tags =
    typeof body.tags === 'string'
      ? body.tags
      : JSON.stringify(Array.isArray(body.tags) ? body.tags : []);
  updateProject({
    id,
    slug: String(body.slug ?? ''),
    title: String(body.title ?? ''),
    tags,
    description: String(body.description ?? ''),
    image: String(body.image ?? ''),
    link: String(body.link ?? ''),
    year: String(body.year ?? ''),
    visible: body.visible !== false,
    order: Number(body.order) || 0,
  });
  return ok({ projects: getProjects(true) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAuth();
  if (guard) return guard;
  const id = Number((await params).id);
  if (!id) return bad('Missing id');
  deleteProject(id);
  return ok({ projects: getProjects(true) });
}
