import { User } from "@/types/User";
import FlipAnimation from "@/components/Card/FlipAnimation";

export default function Sparkle() {
  // デモデータ
  const demoUser: User = {
    id: "1",
    username: "onnenai_w57",
    name: "Onnenai",
    affiliation: "Project Manager / Frontend\nEngineer / Composer / DJ",

    icon_url: "https://links.onnenai.cc/images/icon.png",
    social_links: [
      "https://x.com/onnenai_w57",
      "https://instagram.com/onnenai_w57",
      "https://discord.gg/",
      "https://github.com/usamimi39",
      "https://blogs.onnenai.cc",
    ],
  };

  return (
    <div className="flex items-center flex-col mt-8">
      <div className="w-full p-4 gap-4">
        <FlipAnimation user={demoUser} />
      </div>
    </div>
  );
}
