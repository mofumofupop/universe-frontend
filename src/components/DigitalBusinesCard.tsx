"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Instagram,
  Link as LinkIcon,
  RefreshCcw,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// ユーザー定義の型定義をインポート
import { User } from "@/types/User";

interface DigitalBusinessCardProps {
  user: User;
}

export default function DigitalBusinessCard({
  user,
}: DigitalBusinessCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // カードを裏返す処理
  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* 3D空間の定義 */}
      <div className="group h-[250px] w-[400px] [perspective:1000px]">
        {/* カード本体 */}
        <motion.div
          className="relative h-full w-full rounded-xl shadow-2xl transition-all duration-500 [transform-style:preserve-3d]"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          {/* =======================
              SURFACE: 表面 (Front)
             ======================= */}
          <div className="absolute inset-0 h-full w-full rounded-xl bg-slate-50 p-6 [backface-visibility:hidden]">
            <div className="flex h-full flex-col justify-between">
              {/* 上部: プロフィール情報 */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
                    <AvatarImage
                      src={user.icon_url}
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="mt-1 text-slate-800 flex-1">
                  <h2 className="text-2xl font-bold tracking-tight leading-tight">
                    {user.name}
                  </h2>
                  {/* affiliationはスラッシュ区切りなどで改行したい場合のために whitespace-pre-wrap を入れています */}
                  <p className="text-sm font-medium text-slate-500 mt-1 leading-snug whitespace-pre-wrap">
                    {user.affiliation}
                  </p>
                </div>
              </div>

              {/* 中部: ソーシャルリンク (URLから自動判定) */}
              <div className="mt-2 flex justify-center gap-3">
                {user.social_links.map((link, index) => (
                  <SocialDiamond key={index} url={link} />
                ))}
              </div>

              {/* 右下: 裏返すトリガー */}
              <div
                className="absolute bottom-4 right-4 cursor-pointer p-2 text-slate-400 hover:text-slate-600 transition-colors"
                onClick={handleFlip}
              >
                <RefreshCcw size={16} />
              </div>
            </div>
          </div>

          {/* =======================
              BACK: 裏面 (QR Code)
             ======================= */}
          <div className="absolute inset-0 h-full w-full rounded-xl bg-slate-50 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex h-full flex-col items-center justify-center relative">
              {/* 装飾 */}
              <div className="absolute left-8 top-12 h-8 w-8 rotate-45 rounded bg-slate-200/50" />
              <div className="absolute right-8 bottom-12 h-6 w-6 rotate-45 rounded bg-slate-300" />

              {/* QRコードエリア */}
              {/* 実際は qrcode.react などのライブラリでURLから生成すると便利です */}
              <div className="bg-white p-2 rounded shadow-sm">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    window.location.href
                  )}`}
                  alt="QR Code"
                  width={112}
                  height={112}
                  className="h-28 w-28"
                />
              </div>

              {/* ユーザー名 (ID) */}
              <p className="mt-4 text-sm font-mono text-slate-500">
                @{user.username}
              </p>

              {/* 戻るトリガー */}
              <div
                className="absolute bottom-4 right-4 cursor-pointer p-2 text-slate-400 hover:text-slate-600 transition-colors"
                onClick={handleFlip}
              >
                <RefreshCcw size={16} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Sub Component: URLからアイコンを自動判定するダイヤモンドボタン
// ------------------------------------------------------------------
function SocialDiamond({ url }: { url: string }) {
  const getIcon = (link: string) => {
    const l = link.toLowerCase();
    if (l.includes("twitter") || l.includes("x.com"))
      return <Twitter size={20} />;
    if (l.includes("github")) return <Github size={20} />;
    if (l.includes("instagram")) return <Instagram size={20} />;
    if (l.includes("linkedin")) return <Linkedin size={20} />;
    if (l.includes("facebook")) return <Facebook size={20} />;
    return <LinkIcon size={20} />; // デフォルト
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center"
    >
      <div className="relative flex h-10 w-10 items-center justify-center transition-transform hover:scale-110">
        <div className="absolute inset-0 rotate-45 rounded-lg bg-slate-500 shadow-sm transition-colors group-hover:bg-slate-700" />
        <div className="relative text-white">{getIcon(url)}</div>
      </div>
    </a>
  );
}
