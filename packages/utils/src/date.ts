export function formatTime(time: string): string {
  return time;
}

export function formatDate(date: string, locale: 'fa' | 'en' = 'fa'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US');
}

export function formatDateTime(date: string, locale: 'fa' | 'en' = 'fa'): string {
  const d = new Date(date);
  return d.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US');
}

export function getDayOfWeek(date: string, locale: 'fa' | 'en' = 'fa'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'long' });
}
