const IconBackgroundShape = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 344 344" xmlns="http://www.w3.org/2000/svg" className={`${className} fill-current`}>
    <path d="M316.41,212.4c-51.65,20.39-83.62,52.36-104.01,104.01-14.52,36.79-66.28,36.79-80.8,0-20.39-51.65-52.36-83.62-104.01-104.01-36.79-14.52-36.79-66.28,0-80.8,51.65-20.39,83.62-52.36,104.01-104.01,14.52-36.79,66.28-36.79,80.8,0,20.39,51.65,52.36,83.62,104.01,104.01,36.79,14.52,36.79,66.28,0,80.8Z" />
  </svg>
);

export const Star = () => {
  return (
    <IconBackgroundShape className="absolute inset-0 w-full h-full text-current" />
  );
}