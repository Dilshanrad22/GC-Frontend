const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
).replace(/\/api\/v1\/?$/, '');

export function resolveImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${BACKEND_ORIGIN}/uploads/${imageUrl}`;
}
