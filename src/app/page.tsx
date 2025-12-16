import { User } from "@/types/User";;
import { CardFront } from "@/components/CardFront";

export default function Home() {
  // 本来はここで fetch などをしますが、まずは固定データを作ります
  const demoUser: User = {
    id: "1",
    username: "onnenai_w57",
    name: "Onnenai",
    // デザインのように複数行にしたい場合は改行コード(\n)を入れます
    affiliation: "Project Manager / Frontend\nEngineer / Composer / DJ",
  
    icon_url: "https://links.onnenai.cc/images/icon.png", 
    social_links: [
      "https://x.com/onnenai_w57",
      "https://instagram.com/onnenai_w57",
      "https://discord.gg/",
      "https://github.com/usamimi39",
      "https://blogs.onnenai.cc"
    ]
  };

  return (
    <div className="flex items-center flex-col mt-8">
      <div className="p-4">
        <CardFront user={demoUser} />
      </div>
    </div>
  );
}