"use client";

import React, { useState, useEffect } from "react";
import { useIsLoggedIn } from "@/lib/useIsLoggedIn";
import AccountMenu from "@/components/AccountMenu";
import { useRouter } from "next/navigation";
import { clearAuthFromStorage } from "@/lib/api";
import { Scan, User } from "lucide-react";
import { getAuthFromStorage } from "@/lib/api";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

import { Button } from "@/components/ui/button";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Header({ children, className }: HeaderProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'login' | 'signup'>('login');
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();
  const pathname = usePathname();
  const isScannerPage = pathname?.startsWith("/scanner");

  const handleHeaderCancel = () => {
    const { userId, passwordHash } = getAuthFromStorage();
    if (userId && passwordHash) {
      router.push("/sparkle");
    } else {
      router.push("/");
    }
  };


  const openLoginForm = () => {
    setFormType('login');
    setIsFormOpen(true);
  };

  const openSignupForm = () => {
    setFormType('signup');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  // Listen for global openAuth events from other components (e.g., HomeHero)
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ type: 'login' | 'signup' }>;
      if (!ce?.detail) return;
      if (ce.detail.type === 'login') openLoginForm();
      if (ce.detail.type === 'signup') openSignupForm();
    };
    window.addEventListener('openAuth', handler as EventListener);
    return () => window.removeEventListener('openAuth', handler as EventListener);
  }, []);

  const handleLogout = () => {
    clearAuthFromStorage();
    router.push("/");
    // 状態反映のためリロード（軽微なアプリ内の状態更新に置き換えても良い）
    window.location.reload();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 w-full bg-gradient-to-b from-gray-900 to-gray-900/50 pl-8 pr-8 py-0 z-50 ${className || ''}`}>
      <div className="w-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center -ml-4 pl-6 pr-6 py-3">
          <Logo className="h-10 w-auto text-white" />
        </div>

        {/* Children and Auth Buttons */}
        <div className="flex items-center gap-3 relative">
          {children}
          {isScannerPage ? (
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-full focus:outline-none bg-transparent"
                onClick={handleHeaderCancel}
                aria-label="Cancel"
                title="Cancel"
              >
                <span className="w-6 h-6 inline-flex items-center justify-center">
                  {(() => {
                    // アイコンは常にUserに統一
                    return <User size={20} className="text-white" />;
                  })()}
                </span>
              </button>
              {isLoggedIn === true && <AccountMenu onLogout={handleLogout} buttonClassName="" iconClassName="text-white" />}
            </div>
          ) : isLoggedIn === true ? (
            <>
              {/* Scan Icon (no frame, white icon) */}
              <button
                className="p-2 rounded-full focus:outline-none inline-flex items-center justify-center"
                onClick={() => router.push("/scanner")}
                aria-label="Scan QR"
              >
                <span className="w-6 h-6 inline-flex items-center justify-center">
                  <Scan size={20} className="text-white" />
                </span>
              </button>
              {/* Account Menu (no frame, white icon) */}
              <AccountMenu onLogout={handleLogout} buttonClassName="" iconClassName="text-white" />
            </>
          ) : isLoggedIn === false ? (
            <>
              <Button 
                variant="outline"
                className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600 rounded-md px-6 py-2 font-medium"
                onClick={openSignupForm}
              >
                Sign up
              </Button>
              <Button 
                className="bg-white hover:bg-gray-100 text-gray-900 rounded-md px-6 py-2 font-medium border-none"
                onClick={openLoginForm}
              >
                Log in
              </Button>
            </>
          ) : (
            // 初期読み込み中（レイアウト崩れを防ぐためのプレースホルダー）
            <>
              <button className="p-2 rounded-full focus:outline-none inline-flex items-center justify-center opacity-0 pointer-events-none">
                <span className="w-6 h-6 inline-flex items-center justify-center">
                  <Scan size={20} />
                </span>
              </button>
              <AccountMenu onLogout={() => {}} buttonClassName="pointer-events-none" iconClassName="opacity-0" />
            </>
          )}
          {/* Form Display */}
          {isFormOpen && (
            <div 
              className="fixed inset-0 z-40 flex items-start justify-center pt-24 pb-8 overflow-y-auto"
              onClick={closeForm}
            >
              <div className="my-auto" onClick={(e) => e.stopPropagation()}>
                {formType === 'login' ? (
                  <LoginForm onSwitchToSignup={openSignupForm} />
                ) : (
                  <SignupForm onSwitchToLogin={openLoginForm} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}