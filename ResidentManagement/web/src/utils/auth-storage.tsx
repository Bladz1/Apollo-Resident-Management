import { jwtDecode } from 'jwt-decode';

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

type JwtClaims = Record<string, unknown>;

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function dispatchAuthChanged(detail: AuthChangeDetail) {
  if (!isBrowser()) return;

  window.dispatchEvent(new CustomEvent<AuthChangeDetail>(AUTH_CHANGE_EVENT, { detail }));
}

function decodeClaims(token: string | null | undefined): JwtClaims | null {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode<JwtClaims>(token);
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
  const claims = decodeClaims(token);
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

function deriveIdFromJwt(token: string | null | undefined): string | null {
  const claims = decodeClaims(token);
  if (!claims) {
    return null;
  }

  const id = pickString(claims, ['uid', 'user_id', 'sub', 'id']);
  
  return id ?? null;
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

export function extractIdFromToken(token: string | null | undefined): string | null {
  return deriveIdFromJwt(token);
}