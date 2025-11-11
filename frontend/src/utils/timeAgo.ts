export const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // sekundy

  const minute = 60;
  const hour = 60 * 60;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)} minutes ago`;
  if (diff < day) return `${Math.floor(diff / hour)} hours ago`;
  if (diff < week) return `${Math.floor(diff / day)} days ago`;
  if (diff < month) return `${Math.floor(diff / week)} weeks ago`;
  if (diff < year) return `${Math.floor(diff / month)} months ago`;
  return `${Math.floor(diff / year)} years ago`;
};
