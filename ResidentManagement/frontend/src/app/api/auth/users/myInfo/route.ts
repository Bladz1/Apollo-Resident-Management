import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080';

function decodeBase64Url(input: string): string | null {
    try {
        const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
        const pad = normalized.length % 4 ? '='.repeat(4 - (normalized.length % 4)) : '';
        return Buffer.from(normalized + pad, 'base64').toString('utf8');
    } catch {
        return null;
    }
}

function parseJwt(token: string): Record<string, unknown> | null {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = decodeBase64Url(parts[1]);
    if (!payload) return null;
    try {
        return JSON.parse(payload) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function splitRoles(value: string): string[] {
    return value
        .split(/[;,]/)
        .flatMap((seg) => seg.split(/\s+/))
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.toUpperCase());
}

function normalizeRoles(value: unknown): string[] | null {
    if (!value) return null;

    const collected = new Set<string>();
    const queue: unknown[] = [value];
    const visited = new Set<object>();

    while (queue.length) {
        const cur = queue.shift();
        if (!cur) continue;

        if (typeof cur === 'string') {
            splitRoles(cur).forEach((r) => collected.add(r));
            continue;
        }

        if (Array.isArray(cur)) {
            cur.forEach((x) => queue.push(x));
            continue;
        }

        if (typeof cur === 'object') {
            if (visited.has(cur as object)) continue;
            visited.add(cur as object);
            Object.values(cur as Record<string, unknown>).forEach((v) => queue.push(v));
        }
    }

    return collected.size ? Array.from(collected) : null;
}

function deriveRolesFromJwt(token: string): string[] {
    const claims = parseJwt(token);
    if (!claims) return [];

    const keys = ['roles', 'role', 'authorities', 'permissions', 'scopes', 'scope'];
    for (const k of keys) {
        const r = normalizeRoles(claims[k]);
        if (r?.length) return r;
    }

    const realmAccess = claims['realm_access'];
    if (realmAccess && typeof realmAccess === 'object') {
        const r = normalizeRoles((realmAccess as Record<string, unknown>)['roles']);
        if (r?.length) return r;
    }

    const resourceAccess = claims['resource_access'];
    if (resourceAccess && typeof resourceAccess === 'object') {
        for (const v of Object.values(resourceAccess as Record<string, unknown>)) {
            if (v && typeof v === 'object') {
                const r = normalizeRoles((v as Record<string, unknown>)['roles']);
                if (r?.length) return r;
            }
        }
    }

    return [];
}

export async function GET() {
    try {
        const store: any = cookies();
        const cookieStore = typeof store?.then === 'function' ? await store : store;

        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized (missing token cookie)' }, { status: 401 });
        }

        const res = await fetch(`${API_BASE_URL}/users/myInfo`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            return NextResponse.json(
                { message: 'Backend rejected', status: res.status, body: text },
                { status: res.status },
            );
        }

        const data = await res.json();
        const roles = deriveRolesFromJwt(token);

        return NextResponse.json({ ...data, roles });
    } catch (e) {
        console.error('🔥 /api/auth/users/myInfo ERROR:', e);
        return NextResponse.json(
            { message: 'Internal error in myInfo route', error: e instanceof Error ? e.message : String(e) },
            { status: 500 },
        );
    }
}
