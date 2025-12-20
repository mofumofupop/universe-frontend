"use client"; // クライアントコンポーネントであることを明示

import { Map } from "@/components/ui/map"; // shadcnのMap
import { ImageOverlay, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { User } from "@/types/User";
import { renderToString } from "react-dom/server";
import { CardPopUp } from "@/components/Card/CardPopUp";

// User型に座標情報と関係タイプを追加した型
type SpaceUser = User & {
  position: [number, number]; // [y, x]
  relationType: "self" | "friend" | "friend_of_friend"; // 関係タイプ
};

interface SpaceMapProps {
  users: SpaceUser[];
}

// 注意: export default にしておくと dynamic import が少し楽になります
export default function SpaceMap({ users }: SpaceMapProps) {
  // 画像サイズ（設定する背景画像に合わせて変更してください）
  const imageWidth = 2000;
  const imageHeight = 2000;
  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [imageHeight, imageWidth],
  ];

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
        <ImageOverlay
          url="/images/unibg.png" // publicフォルダに画像を置く
          bounds={bounds}
        />

        {/* ユーザーのマーカーを表示 */}
        {users.map((user) => {
          const isFriendOfFriend = user.relationType === "friend_of_friend";

          // icon_urlを使用したカスタムアイコンを作成
          const customIcon = L.divIcon({
            html: renderToString(
              <div
                className="relative w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white"
                style={{ opacity: isFriendOfFriend ? 0.5 : 1 }}
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
            iconSize: [48, 48],
            iconAnchor: [24, 24],
          });

          return (
            <Marker key={user.id} position={user.position} icon={customIcon}>
              {/* friends_friendsの場合はポップアップを表示しない */}
              {!isFriendOfFriend && (
                <Popup
                  maxWidth={300}
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
