'use client';

import { useTokenRefresh } from '@/utils/useTokenRefresh';

/**
 * Invisible provider component that activates the token-refresh interval.
 * Place inside the root layout so it runs on every page.
 */
export default function TokenRefreshProvider() {
    useTokenRefresh();
    return null;
}
