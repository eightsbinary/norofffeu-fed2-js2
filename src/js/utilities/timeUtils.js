export function timeUtils(createdDate) {
  const now = new Date();
  const createdTime = new Date(createdDate);
  const secondsAgo = Math.floor((now - createdTime) / 1000);

  let interval = Math.floor(secondsAgo / 31536000); // years
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return '1 year ago';

  interval = Math.floor(secondsAgo / 2592000); // months
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return '1 month ago';

  interval = Math.floor(secondsAgo / 86400); // days
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return '1 day ago';

  interval = Math.floor(secondsAgo / 3600); // hours
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return '1 hour ago';

  interval = Math.floor(secondsAgo / 60); // minutes
  if (interval > 1) return `${interval} minutes ago`;
  if (interval === 1) return '1 minute ago';

  return secondsAgo > 1 ? `${secondsAgo} seconds ago` : 'just now';
}
