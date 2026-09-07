const RECENT_TOOLS_KEY = 'documentnest_recent_tools';
const FAVORITES_KEY = 'documentnest_favorites';

export function getRecentTools(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_TOOLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addRecentTool(toolId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const recents = getRecentTools().filter((id) => id !== toolId);
    recents.unshift(toolId);
    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(recents.slice(0, 8)));
  } catch (e) {
    console.error('Failed to save recent tool', e);
  }
}

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isFavorite(toolId: string): boolean {
  return getFavorites().includes(toolId);
}

export function toggleFavorite(toolId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const favs = getFavorites();
    const exists = favs.includes(toolId);
    const updated = exists ? favs.filter((id) => id !== toolId) : [...favs, toolId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return !exists;
  } catch (e) {
    return false;
  }
}
