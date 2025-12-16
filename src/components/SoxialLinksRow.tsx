import { SocialIcon } from './SocialIcon';
import type { User } from '@/types/User'; 

interface SocialLinksRowProps {
  links: User['social_links'];
}

export const SocialLinksRow = ({ links }: SocialLinksRowProps) => {
  const MAX_SLOTS = 5;
  const paddedLinks = [...links];
  while (paddedLinks.length < MAX_SLOTS) {
    paddedLinks.push(null as unknown as string); 
  }

  return (
    // w-full で幅いっぱい確保し、grid-cols-5 で均等に5分割する
    <div className="grid grid-cols-5 gap-0 w-full px-4 items-start">
      {paddedLinks.slice(0, MAX_SLOTS).map((link, index) => {
        const isLowPosition = index % 2 !== 0;

        return (
          <div
            key={index}
            // aspect-square を指定することで、幅が縮んでも正方形を保つ
            // mtのロジックはそのまま
            className={`w-full aspect-square transition-all duration-500 ${
              isLowPosition ? 'mt-[50%]' : 'mt-0' 
            }`}
          >
            {/* SocialIconは w-full h-full なので、この親divのサイズにフィットする */}
            <SocialIcon url={link} />
          </div>
        );
      })}
    </div>
  );
};