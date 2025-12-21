"use client"; // クライアントコンポーネントであることを明示

import { useState } from "react";
import { Map } from "@/components/ui/map"; // shadcnのMap
import {
  ImageOverlay,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { User } from "@/types/User";
import { renderToString } from "react-dom/server";
import { CardPopUp } from "@/components/Card/CardPopUp";
import { SimpleUserPopUp } from "@/components/Card/SimpleUserPopUp";

// User型に座標情報と関係タイプを追加した型
type SpaceUser = User & {
  position: [number, number]; // [y, x]
  relationType: "self" | "friend" | "friend_of_friend"; // 関係タイプ
  connectedTo?: string; // 接続元のユーザーID（friend_of_friendの場合）
};

interface SpaceMapProps {
  users: SpaceUser[];
}

// 注意: export default にしておくと dynamic import が少し楽になります
export default function SpaceMap({ users }: SpaceMapProps) {
  // 選択されたユーザー（線を表示中）
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  // ポップアップが開いているかどうか
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 画像サイズ（設定する背景画像に合わせて変更してください）
  const imageWidth = 2000;
  const imageHeight = 2000;
  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [imageHeight, imageWidth],
  ];

  // マーカークリック時のハンドラー
  const handleMarkerClick = (userId: string, event: L.LeafletMouseEvent) => {
    if (selectedUserId === userId) {
      // 同じユーザーを2回クリック → ポップアップを開く
      // デフォルトの動作を許可（何もしない）
    } else {
      // 別のユーザーをクリック → 線を表示（ポップアップは開かない）
      event.originalEvent.stopPropagation();
      L.DomEvent.stop(event);
      setSelectedUserId(userId);
    }
  };

  // 選択されたユーザーに関連する線を計算
  const getConnectionLines = () => {
    if (!selectedUserId) return [];

    const selectedUser = users.find((u) => u.id === selectedUserId);
    if (!selectedUser) return [];

    const lines: {
      start: [number, number];
      end: [number, number];
      type: string;
    }[] = [];

    if (selectedUser.relationType === "self") {
      // 自分が選択された場合 → 全てのfriendsへの線
      users
        .filter((u) => u.relationType === "friend")
        .forEach((friend) => {
          lines.push({
            start: selectedUser.position,
            end: friend.position,
            type: "self-to-friend",
          });
        });
    } else if (selectedUser.relationType === "friend") {
      // friendが選択された場合 → 自分への線 + そのfriendのfriends_friendsへの線
      const selfUser = users.find((u) => u.relationType === "self");
      if (selfUser) {
        lines.push({
          start: selfUser.position,
          end: selectedUser.position,
          type: "self-to-friend",
        });
      }

      // このfriendを経由したfriends_friendsへの線
      users
        .filter(
          (u) =>
            u.relationType === "friend_of_friend" &&
            u.connectedTo === selectedUserId
        )
        .forEach((friendOfFriend) => {
          lines.push({
            start: selectedUser.position,
            end: friendOfFriend.position,
            type: "friend-to-friend-of-friend",
          });
        });
    } else if (selectedUser.relationType === "friend_of_friend") {
      // friend_of_friendが選択された場合 → 経由したfriendへの線
      if (selectedUser.connectedTo) {
        const connectedFriend = users.find(
          (u) => u.id === selectedUser.connectedTo
        );
        if (connectedFriend) {
          lines.push({
            start: connectedFriend.position,
            end: selectedUser.position,
            type: "friend-to-friend-of-friend",
          });

          // さらに、そのfriendから自分への線も表示
          const selfUser = users.find((u) => u.relationType === "self");
          if (selfUser) {
            lines.push({
              start: selfUser.position,
              end: connectedFriend.position,
              type: "self-to-friend",
            });
          }
        }
      }
    }

    return lines;
  };

  const connectionLines = getConnectionLines();

  // マップクリック時のハンドラー（空白エリアをクリックした時）
  function MapClickHandler() {
    useMapEvents({
      click: () => {
        if (isPopupOpen) {
          // ポップアップが開いている → ポップアップを閉じる
          setIsPopupOpen(false);
        } else if (selectedUserId) {
          // ポップアップが閉じていて、線が表示されている → 線を消す
          setSelectedUserId(null);
        }
      },
    });
    return null;
  }

  return (
    <div className="@container w-full aspect-square mx-auto max-w-lg relative rounded-lg overflow-hidden border border-slate-800 shadow-md">
      <Map
        crs={L.CRS.Simple}
        center={[imageHeight / 2, imageWidth / 2]}
        zoom={-1}
        minZoom={-1.8}
        maxZoom={1}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        className="h-full w-full bg-slate-950" // 背景色を宇宙っぽく
      >
        <MapClickHandler />
        <ImageOverlay
          url="/images/unibg.png" // publicフォルダに画像を置く
          bounds={bounds}
        />

        {/* 接続線を表示 */}
        {connectionLines.map((line, index) => (
          <Polyline
            key={`line-${index}`}
            positions={[line.start, line.end]}
            pathOptions={{
              color:
                line.type === "self-to-friend"
                  ? "#ffffff" // 白（自分→friend）
                  : "#f8fafc", // slate-50（friend→friend_of_friend）
              weight: 1.5,
              opacity: 0.6,
              dashArray: line.type === "self-to-friend" ? undefined : "5, 5",
            }}
          />
        ))}

        {/* ユーザーのマーカーを表示 */}
        {users.map((user) => {
          const isFriendOfFriend = user.relationType === "friend_of_friend";
          const isSelf = user.relationType === "self";

          // アイコンサイズを関係性に応じて変更
          const iconSize = isSelf ? 72 : isFriendOfFriend ? 40 : 48;
          const iconAnchor = isSelf ? 36 : isFriendOfFriend ? 20 : 24;

          // icon_urlを使用したカスタムアイコンを作成
          const customIcon = L.divIcon({
            html: renderToString(
              <div
                className={`relative rounded-full border-2 border-slate-50 shadow-lg overflow-hidden bg-slate-50 ${
                  isSelf
                    ? "w-[60px] h-[60px]"
                    : isFriendOfFriend
                    ? "w-10 h-10"
                    : "w-12 h-12"
                }`}
                style={{
                  filter: isFriendOfFriend
                    ? "brightness(0.7) saturate(0.7)"
                    : "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.icon_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ),
            className: "", // Leafletのデフォルトスタイルを無効化
            iconSize: [iconSize, iconSize],
            iconAnchor: [iconAnchor, iconAnchor],
          });

          return (
            <Marker
              key={user.id}
              position={user.position}
              icon={customIcon}
              eventHandlers={{
                click: (e) => handleMarkerClick(user.id, e),
              }}
            >
              {/* 関係タイプに応じて異なるポップアップを表示 */}
              {isFriendOfFriend ? (
                <Popup
                  maxWidth={280}
                  minWidth={260}
                  className="
                    [&_.leaflet-popup-content-wrapper]:!bg-transparent 
                    [&_.leaflet-popup-content-wrapper]:!shadow-none 
                    [&_.leaflet-popup-content-wrapper]:!rounded-none
                    [&_.leaflet-popup-content]:!p-0 
                    [&_.leaflet-popup-content]:!m-0 
                    [&_.leaflet-popup-content]:!w-[260px]
                  "
                  eventHandlers={{
                    add: () => setIsPopupOpen(true),
                    remove: () => setIsPopupOpen(false),
                  }}
                >
                  <SimpleUserPopUp user={user} />
                </Popup>
              ) : (
                <Popup
                  maxWidth={320}
                  minWidth={280}
                  className="
                    [&_.leaflet-popup-content-wrapper]:!bg-transparent 
                    [&_.leaflet-popup-content-wrapper]:!shadow-none 
                    [&_.leaflet-popup-content-wrapper]:!rounded-none
                    [&_.leaflet-popup-content]:!p-0 
                    [&_.leaflet-popup-content]:!m-0 
                    [&_.leaflet-popup-content]:!w-[280px]
                    [&_.leaflet-popup-content_*]:!all-[revert]
                  "
                  eventHandlers={{
                    add: () => setIsPopupOpen(true),
                    remove: () => setIsPopupOpen(false),
                  }}
                >
                  <CardPopUp user={user} />
                </Popup>
              )}
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
