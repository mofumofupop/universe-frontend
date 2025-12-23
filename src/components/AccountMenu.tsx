import React, { useState, useRef, useEffect } from "react";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import EditProfileModal from "@/components/EditProfileModal";

interface MenuProps {
  onLogout?: () => void;
  /** ボタン用の追加クラス（ヘッダー内では枠を消す等に使います） */
  buttonClassName?: string;
  /** アイコンの色クラス（例: 'text-white'） */
  iconClassName?: string;
}

export default function AccountMenu({
  onLogout,
  buttonClassName,
  iconClassName,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const [showProfileOpen, setShowProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 外部クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        className={`p-2 rounded-full focus:outline-none inline-flex items-center justify-center ${
          buttonClassName || ""
        }`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        {/* アイコンのアニメーション切替 */}
        <span className="relative w-6 h-6 inline-block">
          <Menu
            size={20}
            className={`absolute inset-0 m-auto transition-transform duration-200 ease-in-out ${
              open
                ? "opacity-0 scale-90 -rotate-90"
                : "opacity-100 scale-100 rotate-0"
            } ${iconClassName || "text-slate-700"}`}
          />
          <X
            size={20}
            className={`absolute inset-0 m-auto transition-transform duration-200 ease-in-out ${
              open
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-90 rotate-90"
            } ${iconClassName || "text-slate-700"}`}
          />
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black/10 z-[9999] border border-slate-300 overflow-hidden">
          <div className="px-6 py-3 font-bold text-lg text-slate-800">
            My Account
          </div>
          <div className="border-t border-slate-200" />
          <button onClick={() => { setOpen(false); setShowProfileOpen(true); }} className="flex items-center gap-2 px-6 py-3 w-full text-slate-800 hover:bg-slate-100 first:rounded-t-lg last:rounded-b-lg">
            <User size={18} /> <span>Profile</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 w-full text-slate-800 hover:bg-slate-100 first:rounded-t-lg last:rounded-b-lg">
            <Settings size={18} /> <span>Settings</span>
          </button>
          <div className="border-t border-slate-200" />
          <button
            className="flex items-center gap-2 px-6 py-3 w-full text-red-700 hover:bg-red-50 first:rounded-t-lg last:rounded-b-lg"
            onClick={onLogout}
          >
            <LogOut size={18} /> <span>Log out</span>
          </button>
        </div>
      )}
      <EditProfileModal open={showProfileOpen} onOpenChange={setShowProfileOpen} />
    </div>
  );
}
