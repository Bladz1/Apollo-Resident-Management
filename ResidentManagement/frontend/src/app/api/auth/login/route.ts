import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body?.token;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ ok: false, message: 'Missing token' }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });

    // ✅ Cookie để middleware/server đọc được
    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request' }, { status: 400 });
  }
}
