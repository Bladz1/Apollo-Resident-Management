import { jwtDecode } from "node_modules/jwt-decode/build/cjs";

export const TOKEN_KEY = 'resident-management.authToken';
export const USERNAME_KEY = 'resident-management.username';
export const AUTH_CHANGE_EVENT = 'resident-management:auth-changed';

export type StoredAuth = {
  token: string;
  username: string;
};

export type AuthChangeDetail = {
  token: string | null;
  username: string | null;
};
export type JwtPayload = {
  exp: number;
  iat?: number;
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function dispatchAuthChanged(detail: AuthChangeDetail) {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent<AuthChangeDetail>(AUTH_CHANGE_EVENT, { detail }));
}

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized.padEnd(normalized.length + paddingLength, '=');

    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      const binary = window.atob(padded);
      try {
        const percentEncoded = Array.from(binary)
          .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('');
        return decodeURIComponent(percentEncoded);
      } catch {
        return binary;
      }
    }

    const globalBuffer = typeof globalThis !== 'undefined' ? (globalThis as any).Buffer : undefined;
    if (globalBuffer) {
      return globalBuffer.from(padded, 'base64').toString('utf-8');
    }

    return null;
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

function pickString(source: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const candidate = source[key];
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }
  return null;
}

function splitRoles(value: string): string[] {
  return value
    .split(/[;,]/)
    .flatMap((segment) => segment.split(/\s+/))
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.toUpperCase());
}

function normalizeRoles(value: unknown): string[] | null {
  if (!value) return null;

  const collected = new Set<string>();
  const queue: unknown[] = [value];
  const visited = new Set<object>();

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) continue;

    if (typeof current === 'string') {
      splitRoles(current).forEach((role) => collected.add(role));
      continue;
    }

    if (Array.isArray(current)) {
      current.forEach((item) => queue.push(item));
      continue;
    }

    if (typeof current === 'object') {
      if (visited.has(current as object)) continue;
      visited.add(current as object);

      for (const candidate of Object.values(current as Record<string, unknown>)) {
        queue.push(candidate);
      }
    }
  }

  if (collected.size === 0) return null;
  return Array.from(collected);
}

function deriveUsernameFromJwt(token: string | null | undefined): string | null {
  if (!token) return null;

  const claims = parseJwt(token);
  if (!claims) return null;

  const username = pickString(claims, [
    'fullName',
    'preferred_username',
    'username',
    'user_name',
    'name',
    'sub',
  ]);

  return username ?? null;
}

function deriveIdFromJwt(token: string | null | undefined): string | null {
  if (!token) return null;

  const claims = parseJwt(token);
  if (!claims) return null;

  const id = pickString(claims, ['uid', 'user_id', 'id', 'userId']);
  return id ?? null;
}

function deriveRolesFromJwt(token: string | null | undefined): string[] | null {
  if (!token) return null;

  const claims = parseJwt(token);
  if (!claims) return null;

  const candidateKeys = ['roles', 'role', 'authorities', 'permissions', 'scopes', 'scope'];

  for (const key of candidateKeys) {
    const roles = normalizeRoles(claims[key]);
    if (roles && roles.length > 0) return roles;
  }

  const realmAccess = claims['realm_access'];
  if (realmAccess && typeof realmAccess === 'object') {
    const roles = normalizeRoles((realmAccess as Record<string, unknown>)['roles']);
    if (roles && roles.length > 0) return roles;
  }

  const resourceAccess = claims['resource_access'];
  if (resourceAccess && typeof resourceAccess === 'object') {
    for (const value of Object.values(resourceAccess as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        const roles = normalizeRoles((value as Record<string, unknown>)['roles']);
        if (roles && roles.length > 0) return roles;
      }
    }
  }

  return null;
}

/**
 * ✅ Đồng bộ cookie token để middleware/server đọc được
 * - Set cookie qua POST /api/auth/login
 * - Xoá cookie qua POST /api/auth/logout
 */
async function syncCookieToken(token: string | null) {
  if (!isBrowser()) return;

  try {
    if (token) {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    } else {
      await fetch('/api/auth/logout', { method: 'POST' });
    }
  } catch {
    // Không throw để tránh phá UI khi network tạm lỗi
  }
}

/**
 * Returns the raw stored JWT token, or null if not present.
 */
export function getStoredToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

/**
 * Returns true if the stored access token's `exp` claim is in the past.
 * Returns true (treat as expired) if there is no token or it cannot be decoded.
 */
export function isAccessTokenExpired(): boolean {
  const token = getStoredToken();
  if (!token) return true;

  const claims = parseJwt(token);
  if (!claims || typeof claims.exp !== 'number') return true;

  // exp is in seconds; Date.now() is in milliseconds
  return Date.now() >= claims.exp * 1000;
}

export async function saveAuth(token: string | null | undefined, username: string | null | undefined) {
  if (!isBrowser()) return;

  const normalizedToken = token?.trim() ?? null;
  const normalizedUsername = username?.trim() ?? null;
  const resolvedUsername = normalizedUsername ?? deriveUsernameFromJwt(normalizedToken);

  if (normalizedToken) {
    window.localStorage.setItem(TOKEN_KEY, normalizedToken);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }

  if (resolvedUsername) {
    window.localStorage.setItem(USERNAME_KEY, resolvedUsername);
  } else {
    window.localStorage.removeItem(USERNAME_KEY);
  }

  // ✅ cookie sync (để vào /profile không bị đá /login)
  await syncCookieToken(normalizedToken);

  dispatchAuthChanged({
    token: normalizedToken,
    username: resolvedUsername ?? null,
  });
}

export function loadAuth(): StoredAuth | null {
  if (!isBrowser()) return null;

  const token = window.localStorage.getItem(TOKEN_KEY);
  const storedUsername = window.localStorage.getItem(USERNAME_KEY);

  if (!token) return null;

  const resolvedUsername = storedUsername?.trim() || deriveUsernameFromJwt(token) || '';

  return {
    token,
    username: resolvedUsername,
  };
}

export async function clearAuth() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USERNAME_KEY);

  // ✅ xoá cookie
  await syncCookieToken(null);

  dispatchAuthChanged({ token: null, username: null });
}

export function loadUsername(): string | null {
  if (!isBrowser()) return null;

  const storedUsername = window.localStorage.getItem(USERNAME_KEY);
  if (storedUsername && storedUsername.trim().length > 0) {
    return storedUsername.trim();
  }

  const token = window.localStorage.getItem(TOKEN_KEY);
  return deriveUsernameFromJwt(token);
}

export function loadUserId(): string | null {
  if (!isBrowser()) return null;

  const token = window.localStorage.getItem(TOKEN_KEY);
  return deriveIdFromJwt(token);
}

export function extractUsernameFromToken(token: string | null | undefined): string | null {
  return deriveUsernameFromJwt(token);
}

export function extractIdFromToken(token: string | null | undefined): string | null {
  return deriveIdFromJwt(token);
}

export function extractRolesFromToken(token: string | null | undefined): string[] | null {
  return deriveRolesFromJwt(token);
}
