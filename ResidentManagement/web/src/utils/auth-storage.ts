const TOKEN_KEY = 'resident-management.authToken';
const USERNAME_KEY = 'resident-management.username';
export const AUTH_CHANGE_EVENT = 'resident-management:auth-changed';

export type StoredAuth = {
  token: string;
  username: string;
};

export type AuthChangeDetail = {
  token: string | null;
  username: string | null;
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
  if (parts.length < 2) {
    return null;
  }

  const payload = decodeBase64Url(parts[1]);
  if (!payload) {
    return null;
  }

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

function deriveUsernameFromJwt(token: string | null | undefined): string | null {
  if (!token) {
    return null;
  }

  const claims = parseJwt(token);
  if (!claims) {
    return null;
  }

  const username = pickString(claims, [
    'preferred_username',
    'username',
    'user_name',
    'name',
    'sub',
  ]);

  return username ?? null;
}

export function saveAuth(token: string | null | undefined, username: string | null | undefined) {
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

  dispatchAuthChanged({
    token: normalizedToken,
    username: resolvedUsername ?? null,
  });
}

export function loadAuth(): StoredAuth | null {
  if (!isBrowser()) return null;

  const token = window.localStorage.getItem(TOKEN_KEY);
  const storedUsername = window.localStorage.getItem(USERNAME_KEY);

  if (!token) {
    return null;
  }

  const resolvedUsername = storedUsername?.trim() || deriveUsernameFromJwt(token) || '';

  return {
    token,
    username: resolvedUsername,
  };
}

export function clearAuth() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USERNAME_KEY);
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

export function extractUsernameFromToken(token: string | null | undefined): string | null {
  return deriveUsernameFromJwt(token);
}
