/**
 * Resolves a backend image/video path to a fully-qualified URL.
 *
 * The backend stores paths like:  /uploads/courses/course-xxx.png
 * In development Vite proxies /uploads → http://localhost:3000
 * In production set VITE_UPLOADS_URL to the backend origin, e.g.:
 *   VITE_UPLOADS_URL=https://api.yourdomain.com
 *
 * Rules:
 *  - Already absolute (http/https)  → return as-is
 *  - Relative /uploads/...          → prepend VITE_UPLOADS_URL (or '' for proxy)
 *  - Empty / null / undefined       → return ''
 */

const UPLOADS_ORIGIN =
  import.meta.env.VITE_UPLOADS_URL ||   // explicit override
  (import.meta.env.VITE_API_URL         // derive from API URL if set
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : '');                               // empty = use Vite proxy (dev default)

export const getImageUrl = (path) => {
  if (!path) return '';
  // Already a full URL (external link or blob preview)
  if (/^https?:\/\//i.test(path)) return path;
  // Blob URL created by URL.createObjectURL — pass through
  if (path.startsWith('blob:')) return path;
  // Relative path from backend — prepend origin
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${UPLOADS_ORIGIN}${clean}`;
};

/**
 * Same as getImageUrl but for video files stored in /uploads/lessons/
 */
export const getVideoUrl = getImageUrl;
