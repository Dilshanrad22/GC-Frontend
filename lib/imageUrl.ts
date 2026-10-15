const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
).replace(/\/api\/v1\/?$/, '');

export function resolveImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  // Stored paths may or may not already include the /uploads prefix.
  if (imageUrl.startsWith('/uploads/')) return `${BACKEND_ORIGIN}${imageUrl}`;
  return `${BACKEND_ORIGIN}/uploads/${imageUrl}`;
}
