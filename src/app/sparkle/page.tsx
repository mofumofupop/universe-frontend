"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { User } from "@/types/User";
import FlipAnimation from "@/components/Card/FlipAnimation";
import { getUser, getAccount, getAuthFromStorage } from "@/lib/api";
import Header from "@/components/Header";

// BaseMapを動的にインポート（SSRを無効化）
const SpaceMap = dynamic(() => import("@/components/Universe/BaseMap"), {
  loading: () => (
    <div className="w-full h-[600px] bg-slate-900 flex items-center justify-center text-slate-400 rounded-lg shadow-md">
      <p>Loading Space Map...</p>
    </div>
  ),
  ssr: false,
});

type SpaceUser = User & {
  position: [number, number];
  relationType: "self" | "friend" | "friend_of_friend";
  connectedTo?: string[]; // 接続元のユーザーID配列（friend_of_friendの場合、複数のfriendsからの接続）
};

// ローカルストレージから座標を取得
function getStoredPosition(userId: string): [number, number] | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("userPositions");
  if (!stored) return null;

  try {
    const positions = JSON.parse(stored);
    if (positions[userId]) {
      return [positions[userId].y, positions[userId].x];
    }
  } catch (err) {
    console.error("Failed to parse stored positions:", err);
  }
  return null;
}

// 座標をローカルストレージに保存
function savePosition(userId: string, position: [number, number]): void {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("userPositions");
  const positions = stored ? JSON.parse(stored) : {};
  positions[userId] = { y: position[0], x: position[1] };
  localStorage.setItem("userPositions", JSON.stringify(positions));
}

// ランダムな座標を生成（半径の範囲内）
function generateRandomPosition(
  minRadius: number,
  maxRadius: number
): [number, number] {
  const angle = Math.random() * 2 * Math.PI;
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  const x = 1000 + radius * Math.cos(angle);
  const y = 1000 + radius * Math.sin(angle);
  return [y, x];
}

// ユーザーの座標を取得または生成
function getUserPosition(
  userId: string,
  minRadius: number,
  maxRadius: number
): [number, number] {
  // ローカルストレージから取得を試みる
  const stored = getStoredPosition(userId);
  if (stored) return stored;

  // 新しい座標を生成して保存
  const position = generateRandomPosition(minRadius, maxRadius);
  savePosition(userId, position);
  return position;
}

export default function Sparkle() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [spaceUsers, setSpaceUsers] = useState<SpaceUser[]>([]);
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

        // 自分のユーザー情報を取得
        const userData = await getUser(userId, userId, passwordHash);

        // User型に変換
        const userInfo: User = {
          id: userData.id,
          username: userData.username,
          name: userData.name || userData.username,
          affiliation: userData.affiliation || "",
          icon_url: userData.icon_url || "",
          social_links: userData.social_links || [],
        };

        setUser(userInfo);

        // アカウント情報を取得して友達リストとfriends_friendsを取得
        const accountData = await getAccount(userId, passwordHash);

        // 自分と友達のデータをマップ用に準備
        const users: SpaceUser[] = [];

        // 自分を中央に固定配置
        users.push({
          ...userInfo,
          position: [1000, 1000],
          relationType: "self",
        });

        // 友達を内側の円に配置（半径200-400）
        if (accountData.friends && accountData.friends.length > 0) {
          for (const friend of accountData.friends) {
            try {
              const friendData = await getUser(friend.id, userId, passwordHash);
              const position = getUserPosition(friend.id, 200, 400);

              users.push({
                id: friendData.id,
                username: friendData.username,
                name: friendData.name || friendData.username,
                affiliation: friendData.affiliation || "",
                icon_url: friendData.icon_url || "",
                social_links: friendData.social_links || [],
                position,
                relationType: "friend",
              });
            } catch (err) {
              console.error(`Failed to fetch friend ${friend.id}:`, err);
            }
          }
        }

        // friends_friendsを外側の円に配置（半径450-700）
        if (accountData.friends_friends) {
          console.log("friends_friends data:", accountData.friends_friends);
          const friendsFriendsMap = new Map<string, Set<string>>(); // friendFriendId -> Set of friendIds

          // 重複を除いて、自分と直接の友達以外のユーザーIDを収集
          // connectedTo情報（どのfriendを経由したか）をすべて記録
          Object.entries(accountData.friends_friends).forEach(
            ([friendId, friendsArray]) => {
              console.log(
                `Processing friends_friends for friend ${friendId}:`,
                friendsArray
              );
              friendsArray.forEach((friend) => {
                if (
                  friend.id !== userId &&
                  !accountData.friends.some((f) => f.id === friend.id)
                ) {
                  // すべての接続元friendsを記録
                  if (!friendsFriendsMap.has(friend.id)) {
                    friendsFriendsMap.set(friend.id, new Set());
                  }
                  friendsFriendsMap.get(friend.id)!.add(friendId);
                  console.log(
                    "Added friend_of_friend:",
                    friend.id,
                    friend.username,
                    "via friend:",
                    friendId
                  );
                }
              });
            }
          );

          console.log(
            "Total friends_friends to fetch:",
            friendsFriendsMap.size
          );

          // friends_friendsのユーザー情報を取得して配置
          for (const [
            friendFriendId,
            connectedFriendIds,
          ] of friendsFriendsMap) {
            try {
              const friendFriendData = await getUser(
                friendFriendId,
                userId,
                passwordHash
              );
              const position = getUserPosition(friendFriendId, 450, 700);

              users.push({
                id: friendFriendData.id,
                username: friendFriendData.username,
                name: friendFriendData.name || friendFriendData.username,
                affiliation: friendFriendData.affiliation || "",
                icon_url: friendFriendData.icon_url || "",
                social_links: friendFriendData.social_links || [],
                position,
                relationType: "friend_of_friend",
                connectedTo: Array.from(connectedFriendIds), // すべての接続元friends
              });
              console.log(
                "Successfully added friend_of_friend:",
                friendFriendData.username,
                "connected to:",
                Array.from(connectedFriendIds).join(", ")
              );
            } catch (err) {
              console.error(
                `Failed to fetch friend's friend ${friendFriendId}:`,
                err
              );
            }
          }
        } else {
          console.log("No friends_friends data available");
        }

        setSpaceUsers(users);
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
          <p className="text-red-400">
            {error || "ユーザー情報が見つかりません"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="flex items-center flex-col pt-24 gap-4">
        {/* デジタル名刺 */}
        <div className="w-full p-2">
          <FlipAnimation user={user} />
        </div>

        {/* スペースマップ */}
        <div className="w-full p-2">
          <SpaceMap users={spaceUsers} />
        </div>
      </div>
    </div>
  );
}
