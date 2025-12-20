const icons = [
  'mdi:spotify','mdi:youtube','mdi:soundcloud',
  'mdi:telegram','mdi:linkedin','simple-icons:bluesky',
  'mdi:twitch','mdi:mastodon','simple-icons:misskey',
  'simple-icons:progate','simple-icons:pixiv','simple-icons:fanbox','simple-icons:booth',
  'simple-icons:patreon','simple-icons:ko-fi','simple-icons:buymeacoffee','simple-icons:gumroad','simple-icons:paypal',
  'simple-icons:medium','simple-icons:substack','simple-icons:wordpress','simple-icons:ghost','simple-icons:vimeo',
  'simple-icons:dribbble','simple-icons:behance','simple-icons:artstation','simple-icons:gitlab','simple-icons:stackoverflow',
  'simple-icons:reddit','simple-icons:producthunt','simple-icons:ycombinator','simple-icons:hackernews','simple-icons:line',
  'simple-icons:bilibili','simple-icons:weibo','simple-icons:niconico','simple-icons:steam','simple-icons:xbox'
];

(async () => {
  for (const icon of icons) {
    const url = `https://api.iconify.design/${icon}.svg`;
    const res = await fetch(url);
    console.log(icon, res.ok ? 'OK' : res.status);
  }
})();
