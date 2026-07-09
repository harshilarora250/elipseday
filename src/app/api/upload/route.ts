import { writeFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import crypto from 'node:crypto';
import { requireAuth, ok, bad } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad('Expected multipart form data');
  }
  const file = form.get('file');
  if (!(file instanceof File)) return bad('No file provided');

  if (!ALLOWED.includes(file.type)) {
    return bad('Unsupported image type');
  }
  if (file.size > MAX_BYTES) {
    return bad('File too large (max 4MB)');
  }

  const ext = extname(file.name) || '.png';
  const safeName = crypto.randomUUID() + ext;
  await mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(join(UPLOAD_DIR, safeName), bytes);

  return ok({ url: `/uploads/${safeName}` });
}
