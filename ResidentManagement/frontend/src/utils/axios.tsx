// src/utils/axios.ts
"use client";

import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  isTokenExpired,
  willExpireSoon,
} from "./auth-storage";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const api = axios.create({
  baseURL,
  withCredentials: true, // if refresh token uses cookies
});

/* -------------------------------------------------- */
/* Refresh token (SINGLE-FLIGHT, SAFE)                 */
/* -------------------------------------------------- */

let refreshPromise: Promise<string> | null = null;

async function refreshToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then((res) => {
        const newToken = res.data.accessToken;
        setAccessToken(newToken);
        return newToken;
      })
      .catch((err) => {
        removeAccessToken();
        window.location.href = "/login";
        return Promise.reject(err); // ✅ QUAN TRỌNG
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}


/* -------------------------------------------------- */
/* REQUEST INTERCEPTOR                                 */
/* -------------------------------------------------- */

api.interceptors.request.use(async (config) => {
  const token = getAccessToken();

  if (!token) return config;

  if (isTokenExpired(token) || willExpireSoon(token)) {
    const newToken = await refreshToken();
    config.headers.Authorization = `Bearer ${newToken}`;
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* -------------------------------------------------- */
/* RESPONSE INTERCEPTOR (OPTIONAL SAFETY)              */
/* -------------------------------------------------- */

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      removeAccessToken();
      window.location.href = "/login";
    }
    return Promise.reject(error); // ✅ KHÔNG TREO
  }
);
export default api;