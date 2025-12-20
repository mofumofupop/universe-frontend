"use client";

import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SimpleUserPopUpProps {
  user: User;
}

export function SimpleUserPopUp({ user }: SimpleUserPopUpProps) {
  return (
    <div className="w-[240px] font-inter bg-slate-50 rounded-lg flex flex-row items-center p-4 shadow-lg gap-3">
      {/* アバター */}
      <Avatar className="w-16 h-16 shadow-md flex-shrink-0">
        <AvatarImage src={user.icon_url} alt={user.name} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {/* ユーザー情報 */}
      <div className="flex flex-col items-start text-left gap-0.5 flex-1 min-w-0">
        <span className="block text-base font-bold leading-tight text-slate-900 truncate w-full">
          {user.name}
        </span>
        {user.affiliation && (
          <span className="block text-xs leading-tight text-slate-600 break-words w-full">
            {user.affiliation}
          </span>
        )}
      </div>
    </div>
  );
}
