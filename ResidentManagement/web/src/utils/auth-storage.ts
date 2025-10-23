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

export function saveAuth(token: string | null | undefined, username: string | null | undefined) {
  if (!isBrowser()) return;

  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }

  if (username) {
    window.localStorage.setItem(USERNAME_KEY, username);
  } else {
    window.localStorage.removeItem(USERNAME_KEY);
  }

  dispatchAuthChanged({
    token: token ?? null,
    username: username ?? null,
  });
}

export function loadAuth(): StoredAuth | null {
  if (!isBrowser()) return null;

  const token = window.localStorage.getItem(TOKEN_KEY);
  const username = window.localStorage.getItem(USERNAME_KEY);

  if (!token) {
    return null;
  }

  return {
    token,
    username: username ?? '',
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
  return window.localStorage.getItem(USERNAME_KEY);
}
