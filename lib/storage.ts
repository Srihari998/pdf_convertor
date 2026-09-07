'use client';

const FAVORITES_KEY = 'calcnest_favorites';
const RECENT_KEY = 'calcnest_recent';
const MAX_RECENT = 8;

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(toolId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const favorites = getFavorites();
    const index = favorites.indexOf(toolId);
    let isFav = false;
    if (index > -1) {
      favorites.splice(index, 1);
      isFav = false;
    } else {
      favorites.push(toolId);
      isFav = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new Event('calcnest_storage_change'));
    return isFav;
  } catch {
    return false;
  }
}

export function isFavorite(toolId: string): boolean {
  if (typeof window === 'undefined') return false;
  const favorites = getFavorites();
  return favorites.includes(toolId);
}

export function getRecentTools(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addRecentTool(toolId: string): void {
  if (typeof window === 'undefined') return;
  try {
    let recent = getRecentTools();
    recent = [toolId, ...recent.filter(id => id !== toolId)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    window.dispatchEvent(new Event('calcnest_storage_change'));
  } catch {
    // Ignore localStorage errors
  }
}
