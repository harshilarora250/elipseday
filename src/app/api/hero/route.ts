import { requireAuth, ok, bad, readJson } from '@/lib/api';
import { updateHero } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');

  // Keep only known string fields; chips must be valid JSON.
  const allowed = [
    'kicker', 'nameLine1', 'nameLine2', 'note', 'subtitle',
    'rotatingWords', 'statusText', 'email', 'starImage', 'floatNote', 'chips',
  ];
  const obj: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) obj[k] = String(body[k] ?? '');
  }
  if ('chips' in obj) {
    try {
      JSON.parse(obj.chips as string);
    } catch {
      return bad('Chips must be valid JSON');
    }
  }
  await updateHero(obj);
  return ok({ hero: obj });
}
