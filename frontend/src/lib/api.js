/**
 * Central API configuration.
 * Change NEXT_PUBLIC_API_URL in .env.local for production.
 * Default: http://127.0.0.1:8000
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

/**
 * Returns a full media URL for a given path from the backend.
 * Handles absolute URLs, /media/ paths, and bare relative paths.
 */
export function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/media/')) return `${API_BASE}${path}`;
  return `${API_BASE}/media/${path}`;
}

/**
 * Authenticated fetch wrapper.
 * Adds Authorization header if token is provided.
 */
export async function apiFetch(endpoint, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  return res;
}
