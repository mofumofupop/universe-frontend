"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthFromStorage, getAccount, loginById, clearAuthFromStorage } from "@/lib/api";

export default function AutoLogin() {
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<'idle'|'no-credentials'|'skipped'|'attempting'|'succeeded'|'failed'>('idle');
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log('AutoLogin: useEffect mounted', { attempted });
    if (attempted) {
      console.log('AutoLogin: already attempted, skipping');
      return;
    }
    setAttempted(true);

    const { userId, passwordHash } = getAuthFromStorage();
    console.log('AutoLogin: storage read', { userId, passwordHashMask: passwordHash ? `${passwordHash.slice(0,6)}...` : null });
    if (!userId || !passwordHash) {
      console.log("AutoLogin: no credentials in storage");
      setStatus('no-credentials');
      return;
    }

    // Only run auto-login on the root path to avoid unexpected behavior on other pages
    if (typeof window !== 'undefined' && window.location && window.location.pathname !== '/') {
      console.log('AutoLogin: not on root path, skipping', window.location.pathname);
      setStatus('skipped');
      return;
    }

    // Basic validation of password hash format (SHA-256 hex)
    const isHashLike = /^[0-9a-f]{64}$/i.test(passwordHash);
    if (!isHashLike) {
      console.warn("AutoLogin: stored passwordHash doesn't look like SHA-256 hex; clearing storage to avoid repeated failures", { userId, passwordHash });
      try { clearAuthFromStorage(); } catch {};
      setStatus('failed');
      return;
    }

    (async () => {
      console.log("AutoLogin: attempting to authenticate", { userId, path: typeof window !== 'undefined' ? window.location.pathname : null });
      setStatus('attempting');

      // Prefer getAccount (accepts id + password_hash) which is more explicit
      try {
        await getAccount(userId, passwordHash);
        console.log("AutoLogin: getAccount succeeded, redirecting to /sparkle");
        setStatus('succeeded');
        router.replace("/sparkle");
        return;
      } catch (errGetAccount) {
        console.warn("AutoLogin: getAccount failed", errGetAccount);
      }

      // Fallback: try login by id (/api/login with id field)
      try {
        await loginById(userId, passwordHash);
        console.log("AutoLogin: loginById succeeded, redirecting to /sparkle");
        setStatus('succeeded');
        router.replace("/sparkle");
        return;
      } catch (errLoginById) {
        console.warn("AutoLogin: loginById failed", errLoginById);
      }

      // If both failed, clear stored credentials to avoid retry loops
      try {
        clearAuthFromStorage();
      } catch {
        // ignore
      }
      setStatus('failed');
    })();
  }, [attempted, router]);

  // Only render the debug badge after the component has mounted to avoid SSR/CSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (process.env.NODE_ENV !== 'production' && mounted) {
    return (
      <div aria-live="polite" className="fixed top-2 right-2 z-50 text-xs px-2 py-1 rounded bg-slate-800 text-white opacity-90">
        AutoLogin: {status}
      </div>
    );
  }

  return null;
}
