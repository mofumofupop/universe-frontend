import React, { useState } from "react";

interface MenuProps {
  onLogout?: () => void;
}

export default function AccountMenu({ onLogout }: MenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        className="p-2 rounded-full hover:bg-slate-200 focus:outline-none border border-slate-300"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
      >
        {/* menu icon (3 dots) */}
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black/10 z-50 border border-purple-400">
          <div className="px-6 py-3 font-bold text-lg text-slate-800">My Account</div>
          <div className="border-t border-dotted border-purple-400" />
          <button className="flex items-center gap-2 px-6 py-3 w-full text-slate-800 hover:bg-slate-100">
            <span role="img" aria-label="profile">👤</span> Profile Item
          </button>
          <button className="flex items-center gap-2 px-6 py-3 w-full text-slate-800 hover:bg-slate-100">
            <span role="img" aria-label="settings">⚙️</span> Settings
          </button>
          <div className="border-t border-dotted border-purple-400" />
          <button
            className="flex items-center gap-2 px-6 py-3 w-full text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <span role="img" aria-label="logout">↩️</span> Log out
          </button>
        </div>
      )}
    </div>
  );
}
