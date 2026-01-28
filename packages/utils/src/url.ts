export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractSubdomain(hostname: string, baseDomain: string): string | null {
  if (!hostname.endsWith(baseDomain)) return null;
  const subdomain = hostname.replace(`.${baseDomain}`, '').replace(baseDomain, '');
  return subdomain && subdomain !== 'www' ? subdomain : null;
}
