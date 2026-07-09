import { requireAuth, ok, bad, readJson } from '@/lib/api';
import {
  updateAchievement,
  deleteAchievement,
  getAchievements,
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
  await updateAchievement({
    id,
    year: String(body.year ?? ''),
    title: String(body.title ?? ''),
    description: String(body.description ?? ''),
    visible: body.visible !== false,
    order: Number(body.order) || 0,
  });
  return ok({ items: await getAchievements(true) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAuth();
  if (guard) return guard;
  const id = Number((await params).id);
  if (!id) return bad('Missing id');
  await deleteAchievement(id);
  return ok({ items: await getAchievements(true) });
}
