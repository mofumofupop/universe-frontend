import { Icon } from '@iconify/react';

const IconBackgroundShape = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 344 344" xmlns="http://www.w3.org/2000/svg" className={`${className} fill-current`}>
    <path d="M316.41,212.4c-51.65,20.39-83.62,52.36-104.01,104.01-14.52,36.79-66.28,36.79-80.8,0-20.39-51.65-52.36-83.62-104.01-104.01-36.79-14.52-36.79-66.28,0-80.8,51.65-20.39,83.62-52.36,104.01-104.01,14.52-36.79,66.28-36.79,80.8,0,20.39,51.65,52.36,83.62,104.01,104.01,36.79,14.52,36.79,66.28,0,80.8Z" />
  </svg>
);

interface SocialIconProps {
  url: string | null; 
  className?: string;
}

export const SocialIcon = ({ url, className = '' }: SocialIconProps) => {
  const getIconInfo = (linkUrl: string) => {
    const lowerUrl = linkUrl.toLowerCase();
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return { icon: 'ri:twitter-x-fill' };
    if (lowerUrl.includes('instagram.com')) return { icon: 'mdi:instagram' };
    if (lowerUrl.includes('github.com')) return { icon: 'mdi:github' };
    if (/discord(\.gg|\.com|app\.com|app\.net)/.test(lowerUrl)) return { icon: 'ic:baseline-discord' };
    return { icon: 'lucide:link'}; // 未知のリンク
  };

  const commonClasses = `relative inline-flex items-center justify-center w-full h-full group hover:scale-110 transition-transform duration-300 ${className} [backface-visibility:hidden] [transform-style:preserve-3d]`;

  if (!url) {
    return (
      <div className={commonClasses}>
        <IconBackgroundShape className="absolute inset-0 w-1/2 h-1/2 text-slate-400 drop-shadow-md opacity-50" />
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
      <IconBackgroundShape className="absolute inset-0 w-full h-full text-slate-500" />
      <div className="absolute inset-0 z-10 flex items-center justify-center text-white">
        {icon ? (
          <Icon icon={icon} className="w-[50%] h-[50%]" />
        ) : (
          <span className="text-2xl"></span>
        )}
      </div>
    </a>
  );
};