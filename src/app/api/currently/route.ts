import { requireAuth, ok, bad, readJson } from '@/lib/api';
import {
  createCurrently,
  updateCurrently,
  deleteCurrently,
  getCurrently,
} from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');
  if (!String(body.text ?? '').trim()) return bad('Text is required');
  const id = await createCurrently({
    text: String(body.text),
    sub: String(body.sub ?? ''),
    visible: body.visible !== false,
  });
  return ok({ id, items: await getCurrently(true) });
}

export async function PUT(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body || typeof body.id !== 'number') return bad('Invalid item');
  await updateCurrently({
    id: body.id,
    text: String(body.text ?? ''),
    sub: String(body.sub ?? ''),
    visible: body.visible !== false,
    order: Number(body.order) || 0,
  });
  return ok({ items: await getCurrently(true) });
}

export async function DELETE(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return bad('Missing id');
  await deleteCurrently(id);
  return ok({ items: await getCurrently(true) });
}
