import { requireAuth, ok, bad, readJson } from '@/lib/api';
import {
  updateStat,
  deleteStat,
  getStats,
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
  await updateStat({
    id,
    value: Number(body.value) || 0,
    suffix: String(body.suffix ?? ''),
    label: String(body.label ?? ''),
    visible: body.visible !== false,
    order: Number(body.order) || 0,
  });
  return ok({ stats: await getStats(true) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAuth();
  if (guard) return guard;
  const id = Number((await params).id);
  if (!id) return bad('Missing id');
  await deleteStat(id);
  return ok({ stats: await getStats(true) });
}
