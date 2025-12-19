"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import FlipAnimation from "@/components/Card/FlipAnimation";
import { getUser, getAuthFromStorage } from "@/lib/api";
import Header from "@/components/Header";

export default function Sparkle() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { userId, passwordHash } = getAuthFromStorage();

        if (!userId || !passwordHash) {
          // ログインしていない場合はルートにリダイレクト
          router.push("/");
          return;
        }

        // 自分のユーザー情報を取得（nameとsocial_linksを含む）
        const userData = await getUser(userId, userId, passwordHash);

        // User型に変換
        const userInfo: User = {
          id: userData.id,
          username: userData.username,
          name: userData.name || userData.username, // APIから取得したnameを使用
          affiliation: userData.affiliation || "",
          icon_url: userData.icon_url || "",
          social_links: userData.social_links || [],
        };

        setUser(userInfo);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("ユーザー情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-400">{error || "ユーザー情報が見つかりません"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="flex items-center flex-col pt-24">
        <div className="w-full p-4 gap-4">
          <FlipAnimation user={user} />
        </div>
      </div>
    </div>
  );
}
