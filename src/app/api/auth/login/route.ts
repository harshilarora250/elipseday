import { NextResponse } from 'next/server';
import { verifyPassword, verifyUsername, createSessionToken, setSessionCookie } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const username = (body.username || '').toString();
  const password = (body.password || '').toString();

  // Constant-ish compare; both must match.
  const userOk = verifyUsername(username);
  const passOk = verifyPassword(password);
  if (!userOk || !passOk) {
    return NextResponse.json({ error: 'Wrong username or password' }, { status: 401 });
  }

  const token = createSessionToken();
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
