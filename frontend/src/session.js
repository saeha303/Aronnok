import axios from 'axios';
import { API } from './backend';

// The login token lives in an httpOnly cookie set by the API (not readable
// from JS). We only keep non-sensitive profile info here so the UI knows who
// is signed in and whether to show admin pages.
const KEY = 'aronnok:user';

export function saveSession(user) {
  const { _id, username, firstname, role } = user;
  try {
    localStorage.setItem(KEY, JSON.stringify({ _id, username, firstname, role }));
  } catch {
    // storage unavailable (private mode etc.) - the cookie still authenticates
  }
}

export function getSessionUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export const getCurrentUserId = () => getSessionUser()?._id ?? '';
export const isAdminSession = () => (getSessionUser()?.role ?? 0) !== 0;

export async function signOut() {
  try {
    await axios.get(`${API}/api/signout`);
  } finally {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
}
