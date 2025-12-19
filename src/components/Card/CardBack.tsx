"use client";

import { User } from "@/types/User";
import { CardEdge } from "./CardEdge";
import { QRCodeSVG } from "qrcode.react";
import { Star } from "./Star";
import { useEffect, useState } from "react";
import { generateQRCode, getAuthFromStorage } from "@/lib/api";

interface UserCardProps {
  user: User;
  onFlip?: () => void;
}

export function CardBack({ user, onFlip }: UserCardProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQRCode() {
      try {
        const { userId, passwordHash } = getAuthFromStorage();
        
        if (!userId || !passwordHash) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const qr = await generateQRCode(userId, passwordHash);
        setQrCode(qr);
        setError(null);
      } catch (err) {
        console.error("Failed to generate QR code:", err);
        setError("Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    }

    fetchQRCode();
  }, []);

  return (
    <div className="@container w-full min-w-[300px] aspect-[1.62/1] mx-auto font-inter rounded-lg shadow-md p-[5%] flex flex-col justify-center bg-slate-50 relative">
      <div className="absolute w-[13%] h-[13%] top-[20%] left-[15%] text-slate-400">
        <Star />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="h-[70%] flex justify-center items-center aspect-square bg-slate-50 p-3">
          {loading ? (
            <div className="text-slate-400 text-sm">Loading...</div>
          ) : error ? (
            <div className="text-red-400 text-sm">{error}</div>
          ) : (
            <QRCodeSVG value={qrCode} className="h-full w-full" />
          )}
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