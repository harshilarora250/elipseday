import { requireAuth, ok, bad, readJson } from '@/lib/api';
import { createStat, updateStat, deleteStat, getStats } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');
  if (!String(body.label ?? '').trim()) return bad('Label is required');
  const id = await createStat({
    value: Number(body.value) || 0,
    suffix: String(body.suffix ?? ''),
    label: String(body.label),
    visible: body.visible !== false,
  });
  return ok({ id, stats: await getStats(true) });
}

export async function PUT(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body || typeof body.id !== 'number') return bad('Invalid stat');
  await updateStat({
    id: body.id,
    value: Number(body.value) || 0,
    suffix: String(body.suffix ?? ''),
    label: String(body.label ?? ''),
    visible: body.visible !== false,
    order: Number(body.order) || 0,
  });
  return ok({ stats: await getStats(true) });
}

export async function DELETE(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return bad('Missing id');
  await deleteStat(id);
  return ok({ stats: await getStats(true) });
}
