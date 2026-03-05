'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    getStoredToken,
    isAccessTokenExpired,
    saveAuth,
    clearAuth,
    extractUsernameFromToken,
} from '@/utils/auth-storage';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080/resident-management';

/** Interval in milliseconds between each token check (60 seconds). */
const CHECK_INTERVAL_MS = 60_000;

/**
 * Custom hook that checks JWT expiry every 60 seconds.
 *
 * - If the access token is still valid → do nothing.
 * - If the access token is expired → attempt POST /auth/refresh.
 *   - Success → save the new token.
 *   - Failure → clear auth and redirect to /login.
 */
export function useTokenRefresh() {
    const router = useRouter();
    const refreshingRef = useRef(false);

    useEffect(() => {
        const checkAndRefresh = async () => {
            const token = getStoredToken();

            // No token stored → user is not logged in, nothing to do
            if (!token) return;

            // Token still valid → nothing to do
            if (!isAccessTokenExpired()) return;

            // Prevent concurrent refresh calls
            if (refreshingRef.current) return;
            refreshingRef.current = true;

            try {
                const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                if (!res.ok) {
                    // Refresh failed (token refresh window expired or invalidated)
                    await clearAuth();
                    router.replace('/login');
                    return;
                }

                const data = await res.json();
                const newToken: string | undefined = data?.result?.token;

                if (!newToken) {
                    await clearAuth();
                    router.replace('/login');
                    return;
                }

                const username = extractUsernameFromToken(newToken);
                await saveAuth(newToken, username);
            } catch {
                // Network error or unexpected failure → force logout
                await clearAuth();
                router.replace('/login');
            } finally {
                refreshingRef.current = false;
            }
        };

        // Run once immediately on mount
        void checkAndRefresh();

        // Then check every 60 seconds
        const intervalId = setInterval(() => {
            void checkAndRefresh();
        }, CHECK_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [router]);
}
