import { SocialIcon } from "./SocialIcon";
import type { User } from "@/types/User";

interface SocialLinksRowProps {
  links: User["social_links"];
}

export const SocialLinksRow = ({ links }: SocialLinksRowProps) => {
  const MAX_SLOTS = 5;
  const paddedLinks = [...links];
  while (paddedLinks.length < MAX_SLOTS) {
    paddedLinks.push(null as unknown as string);
  }

  return (
    <div className="grid grid-cols-5 gap-1 w-[80%] mx-auto items-start">
      {paddedLinks.slice(0, MAX_SLOTS).map((link, index) => {
        const isLowPosition = index % 2 !== 0;

        return (
          <div
            key={index}
            className={`w-full aspect-square transition-all duration-500 ${
              isLowPosition ? "mt-[40%]" : "mt-0"
            }`}
          >
            <SocialIcon url={link} />
          </div>
        );
      })}
    </div>
  );
};
