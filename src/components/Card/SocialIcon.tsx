import { Icon } from "@iconify/react";

const IconBackgroundShape = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 344 344"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} fill-current`}
  >
    <path d="M316.41,212.4c-51.65,20.39-83.62,52.36-104.01,104.01-14.52,36.79-66.28,36.79-80.8,0-20.39-51.65-52.36-83.62-104.01-104.01-36.79-14.52-36.79-66.28,0-80.8,51.65-20.39,83.62-52.36,104.01-104.01,14.52-36.79,66.28-36.79,80.8,0,20.39,51.65,52.36,83.62,104.01,104.01,36.79,14.52,36.79,66.28,0,80.8Z" />
  </svg>
);

interface SocialIconProps {
  url: string | null;
  className?: string;
}

export const SocialIcon = ({ url, className = "" }: SocialIconProps) => {
  const getIconInfo = (linkUrl: string) => {
    const lowerUrl = linkUrl.toLowerCase();
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
      return { icon: "ri:twitter-x-fill" };
    if (lowerUrl.includes("instagram.com")) return { icon: "mdi:instagram" };
    if (lowerUrl.includes("github.com")) return { icon: "mdi:github" };
    if (/discord(\.gg|\.com|app\.com|app\.net)/.test(lowerUrl))
      return { icon: "ic:baseline-discord" };
    return { icon: "lucide:link" }; // 未知のリンク
  };

  const commonClasses = `relative inline-flex items-center justify-center w-full h-full group hover:scale-110 transition-transform duration-300 ${className} [backface-visibility:hidden] [transform-style:preserve-3d]`;

  if (!url) {
    return (
      <div className={commonClasses}>
        <IconBackgroundShape className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 text-slate-400 drop-shadow-md opacity-50" />
      </div>
    );
  }

  const { icon } = getIconInfo(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={commonClasses}
    >
      <IconBackgroundShape className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-slate-500" />
      <Icon
        icon={icon}
        className="relative z-10 text-white pointer-events-none"
        style={{ width: "50%", height: "50%", display: "block" }}
      />
    </a>
  );
};
