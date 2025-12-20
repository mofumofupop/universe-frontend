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
    // Normalize and extract hostname safely
    let hostname = "";
    try {
      const parsed = new URL(
        linkUrl.includes("://") ? linkUrl : `https://${linkUrl}`
      );
      hostname = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      // Fallback: strip protocol and www then take up to first slash
      const s = linkUrl
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .toLowerCase();
      hostname = s.split("/")[0];
    }

    const patterns: Array<{ regex: RegExp; icon: string }> = [
      { regex: /(^|\.)x\.com$/i, icon: "ri:twitter-x-fill" },
      { regex: /(^|\.)twitter\.com$/i, icon: "ri:twitter-x-fill" },
      { regex: /(^|\.)instagram\.com$/i, icon: "mdi:instagram" },
      { regex: /(^|\.)github\.com$/i, icon: "mdi:github" },
      {
        regex: /(^|\.)discord(?:\.gg|\.com|app\.com|app\.net)$/i,
        icon: "ic:baseline-discord",
      },
      { regex: /(^|\.)soundcloud\.com$/i, icon: "mdi:soundcloud" },
      { regex: /(^|\.)youtube\.com$|(^|\.)youtu\.be$/i, icon: "mdi:youtube" },
      { regex: /(^|\.)spotify\.com$/i, icon: "mdi:spotify" },
      {
        regex: /(^|\.)t\.me$|(^|\.)telegram\.me$|(^|\.)telegram\.org$/i,
        icon: "mdi:telegram",
      },
      { regex: /(^|\.)linkedin\.com$/i, icon: "mdi:linkedin" },
      { regex: /(^|\.)patreon\.com$/i, icon: "simple-icons:patreon" },
      { regex: /(^|\.)buymeacoffee\.com$/i, icon: "simple-icons:buymeacoffee" },
      { regex: /(^|\.)gumroad\.com$/i, icon: "simple-icons:gumroad" },
      { regex: /(^|\.)paypal\.com$/i, icon: "simple-icons:paypal" },
      { regex: /(^|\.)medium\.com$/i, icon: "simple-icons:medium" },
      { regex: /(^|\.)substack\.com$/i, icon: "simple-icons:substack" },
      { regex: /(^|\.)wordpress\.(com|org)$/i, icon: "simple-icons:wordpress" },
      { regex: /(^|\.)ghost\.org$/i, icon: "simple-icons:ghost" },
      { regex: /(^|\.)vimeo\.com$/i, icon: "simple-icons:vimeo" },
      { regex: /(^|\.)dribbble\.com$/i, icon: "simple-icons:dribbble" },
      { regex: /(^|\.)behance\.net$/i, icon: "simple-icons:behance" },
      { regex: /(^|\.)artstation\.com$/i, icon: "simple-icons:artstation" },
      { regex: /(^|\.)gitlab\.com$/i, icon: "simple-icons:gitlab" },
      {
        regex: /(^|\.)stackoverflow\.com$/i,
        icon: "simple-icons:stackoverflow",
      },
      { regex: /(^|\.)reddit\.com$/i, icon: "simple-icons:reddit" },
      { regex: /(^|\.)producthunt\.com$/i, icon: "simple-icons:producthunt" },
      { regex: /(^|\.)ycombinator\.com$/i, icon: "simple-icons:ycombinator" },
      { regex: /(^|\.)line\.me$/i, icon: "simple-icons:line" },
      { regex: /(^|\.)bilibili\.com$/i, icon: "simple-icons:bilibili" },
      { regex: /(^|\.)niconico\.(jp|com)$/i, icon: "simple-icons:niconico" },
      { regex: /(^|\.)pixiv\.net$/i, icon: "simple-icons:pixiv" },
      { regex: /(^|\.)steam(?:$|\.|\/)/i, icon: "simple-icons:steam" },
      { regex: /(^|\.)xbox\.com$/i, icon: "simple-icons:xbox" },
      { regex: /(^|\.)pixiv\.me$/i, icon: "simple-icons:pixiv" },
      { regex: /(^|\.)fanbox\.cc$/i, icon: "simple-icons:pixiv" },
      { regex: /(^|\.)booth\.pm$/i, icon: "simple-icons:pixiv" },
      {
        regex: /(^|\.)((bsky\.social)|(bluesky\.org))$/i,
        icon: "simple-icons:bluesky",
      },
      { regex: /(^|\.)twitch\.tv$/i, icon: "mdi:twitch" },
      { regex: /(^|\.)mastodon(\.|$)/i, icon: "mdi:mastodon" },
      { regex: /(^|\.)misskey(\.|$)/i, icon: "simple-icons:misskey" },
      { regex: /(^|\.)progate\.com$/i, icon: "simple-icons:progate" },
    ];

    for (const p of patterns) {
      if (p.regex.test(hostname)) return { icon: p.icon };
    }

    return { icon: "lucide:link" };
  };

  const commonClasses = `relative inline-flex items-center justify-center w-full h-full group hover:scale-110 transition-transform duration-300 ${className} [backface-visibility:hidden] [transform-style:preserve-3d]`;

  if (!url) {
    return (
      <div className={commonClasses}>
        <IconBackgroundShape className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] text-slate-400 drop-shadow-md opacity-50" />
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
      <IconBackgroundShape className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] text-slate-500" />
      <Icon
        icon={icon}
        className="relative z-10 text-white pointer-events-none"
        style={{ width: "50%", height: "50%", display: "block" }}
      />
    </a>
  );
};
