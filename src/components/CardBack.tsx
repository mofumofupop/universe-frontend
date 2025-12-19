"use client";

import { User } from "@/types/User";
import { CardEdge } from "./CardEdge";
import { QRCodeSVG } from "qrcode.react";
import { QRcode } from "@/types/QRcode";
import { Star } from "./Star";

interface UserCardProps {
  user: User;
  onFlip?: () => void;
}

const qr: QRcode = { success: "true", qr: "https://links.onnenai.cc/" };

export function CardBack({ user, onFlip }: UserCardProps) {
  return (
    <div className="@container w-full min-w-[300px] aspect-[1.62/1] mx-auto font-inter rounded-lg shadow-md p-[5%] flex flex-col justify-center bg-slate-50 relative">
      <div className="absolute w-[13%] h-[13%] top-[20%] left-[15%] text-slate-400">
        <Star />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="h-[70%] flex justify-center items-center aspect-square bg-slate-50 p-3">
          <QRCodeSVG value={qr.qr} className="h-full w-full" />
        </div>
      </div>
      <div className="absolute w-[10%] h-[10%] bottom-[20%] right-[15%] text-slate-500">
        <Star />
      </div>
      <p className="text-[clamp(8px,2cqw,12px)] text-slate-400 flex justify-center absolute z-10 bottom-[5%] left-1/2 -translate-x-1/2">
        @{user.username}
      </p>
      <CardEdge 
        className="absolute bottom-[5%] right-[5%] text-slate-400 cursor-pointer" 
        onClick={onFlip} 
      />
    </div>
  );
}