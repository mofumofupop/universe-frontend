"use client";

import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialLinksRow } from "./SocialLinksRow";

interface CardPopUpProps {
  user: User;
}

export function CardPopUp({ user }: CardPopUpProps) {
  return (
    <div className="w-[280px] aspect-[1.62/1] font-inter bg-slate-50 rounded-lg flex flex-col justify-center shrink-0 overflow-hidden shadow-lg">
      {/* ヘッダー部分: アバターと基本情報 */}
      <div className="flex items-center gap-3 mx-4 mt-3 pt-4 pl-2">
        <Avatar className="w-16 h-16 shadow-md shrink-0">
          <AvatarImage src={user.icon_url} alt={user.name} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex flex-col gap-1.5 items-start text-left">
            <span className="block text-xl font-bold leading-tight text-slate-900">
              {user.name}
            </span>
            <span className="block text-xs leading-tight text-slate-700">
              {user.affiliation}
            </span>
          </div>
        </div>
      </div>

      {/* ソーシャルリンク */}
      <div className="w-full mx-auto mt-1 mb-1 py-2">
        <SocialLinksRow links={user.social_links} />
      </div>

      {/* ユーザーネーム */}
      <span className="block text-[8px] text-slate-400 text-center -mt-3 mb-3">
        @{user.username}
      </span>
    </div>
  );
}
