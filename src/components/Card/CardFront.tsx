"use client";

import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialLinksRow } from "./SocialLinksRow";
import { CardEdge } from "./CardEdge";

interface UserCardProps {
  user: User;
  onFlip?: () => void;
}

export function CardFront({ user, onFlip }: UserCardProps) {
  return (
    <div className="@container w-full min-w-[300px] aspect-[1.62/1] mx-auto font-inter rounded-lg shadow-md p-[5%] flex flex-col justify-center bg-slate-50 relative overflow-hidden">
      <div className="flex flex-col h-full justify-center">
        <div className="flex items-center gap-[5%] justify-center flex-grow pl-[10%] pr-[5%] pt-[2%] pb-[4%]">
          <div className="w-[28%] max-w-24 aspect-square shrink-0">
            <Avatar className="w-full h-full shadow-md">
              <AvatarImage src={user.icon_url} alt={user.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col w-full max-w-80 min-w-0">
            <div className="flex flex-col gap-2 items-start text-left">
              <p className="text-[clamp(16px,10cqw,30px)] font-bold leading-tight">
                {user.name}
              </p>
              <p className="text-[clamp(12px,2.5cqw,16px)] leading-tight">
                {user.affiliation}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <SocialLinksRow links={user.social_links} />
          <p className="text-[clamp(8px,2cqw,12px)] text-slate-400 flex justify-center -mt-2 [backface-visibility:hidden]">
            @{user.username}
          </p>
        </div>
      </div>
      <CardEdge
        className="absolute bottom-[5%] right-[5%] text-slate-400 cursor-pointer"
        onClick={onFlip}
      />
    </div>
  );
}
