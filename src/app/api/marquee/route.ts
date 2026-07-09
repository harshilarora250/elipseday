import { requireAuth, ok, bad, readJson } from '@/lib/api';
import { updateMarquee } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');

  const obj: Record<string, unknown> = {};
  if ('m1' in body) obj.m1 = String(body.m1 ?? '');
  if ('m2' in body) obj.m2 = String(body.m2 ?? '');
  await updateMarquee(obj);
  return ok({ marquee: obj });
}
