// Base URL of the API. Empty by default: in production the API is served from
// the same origin (/api/...), and in development Vite proxies /api to Express.
// Set VITE_API_URL only if the API is hosted somewhere else.
export const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
