export interface JsonFormatResult {
  formatted: string;
  isValid: boolean;
  error?: string;
  stats?: {
    keys: number;
    depth: number;
    sizeBytes: number;
  };
}

export function formatJSON(input: string, indent = 2): JsonFormatResult {
  if (!input || input.trim() === '') {
    return { formatted: '', isValid: true };
  }
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, indent);
    return {
      formatted,
      isValid: true,
      stats: {
        keys: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1,
        depth: calculateObjectDepth(parsed),
        sizeBytes: new Blob([formatted]).size,
      },
    };
  } catch (err: unknown) {
    return {
      formatted: input,
      isValid: false,
      error: err instanceof Error ? err.message : 'Invalid JSON format',
    };
  }
}

export function minifyJSON(input: string): JsonFormatResult {
  if (!input || input.trim() === '') {
    return { formatted: '', isValid: true };
  }
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed);
    return {
      formatted,
      isValid: true,
      stats: {
        keys: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1,
        depth: calculateObjectDepth(parsed),
        sizeBytes: new Blob([formatted]).size,
      },
    };
  } catch (err: unknown) {
    return {
      formatted: input,
      isValid: false,
      error: err instanceof Error ? err.message : 'Invalid JSON format',
    };
  }
}

function calculateObjectDepth(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0;
  let maxDepth = 0;
  for (const key of Object.keys(obj)) {
    const val = (obj as Record<string, unknown>)[key];
    maxDepth = Math.max(maxDepth, calculateObjectDepth(val));
  }
  return 1 + maxDepth;
}

export function encodeBase64(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch {
    return 'Error encoding string';
  }
}

export function decodeBase64(str: string): string {
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return 'Invalid Base64 string';
  }
}

export function encodeURL(str: string, componentMode = true): string {
  try {
    return componentMode ? encodeURIComponent(str) : encodeURI(str);
  } catch {
    return str;
  }
}

export function decodeURL(str: string, componentMode = true): string {
  try {
    return componentMode ? decodeURIComponent(str) : decodeURI(str);
  } catch {
    return str;
  }
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateMultipleUUIDs(count = 5): string[] {
  const result: string[] = [];
  const safeCount = Math.min(Math.max(1, count), 100);
  for (let i = 0; i < safeCount; i++) {
    result.push(generateUUID());
  }
  return result;
}

export function timestampToDate(timestamp: number) {
  // Check if seconds or milliseconds
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  const d = new Date(ms);
  if (isNaN(d.getTime())) {
    return { error: 'Invalid timestamp' };
  }
  return {
    utc: d.toUTCString(),
    iso: d.toISOString(),
    local: d.toLocaleString(),
    dateOnly: d.toLocaleDateString(),
    timeOnly: d.toLocaleTimeString(),
    relative: getRelativeTimeString(d),
  };
}

export function dateToTimestamp(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return { error: 'Invalid date format' };
  }
  return {
    seconds: Math.floor(d.getTime() / 1000),
    milliseconds: d.getTime(),
    iso: d.toISOString(),
  };
}

function getRelativeTimeString(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec === 0) return 'Just now';
  if (diffSec > 0) {
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    return `${Math.floor(diffSec / 86400)} days ago`;
  } else {
    const futureSec = Math.abs(diffSec);
    if (futureSec < 60) return `in ${futureSec} seconds`;
    if (futureSec < 3600) return `in ${Math.floor(futureSec / 60)} minutes`;
    if (futureSec < 86400) return `in ${Math.floor(futureSec / 3600)} hours`;
    return `in ${Math.floor(futureSec / 86400)} days`;
  }
}

export function hexToRgb(hex: string) {
  let clean = hex.replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return {
    r,
    g,
    b,
    rgbString: `rgb(${r}, ${g}, ${b})`,
    hslString: rgbToHslString(r, g, b),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHslString(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function pxToRem(px: number, base = 16): { rem: number; em: number } {
  if (base <= 0) base = 16;
  const rem = px / base;
  return { rem: parseFloat(rem.toFixed(4)), em: parseFloat(rem.toFixed(4)) };
}

export function remToPx(rem: number, base = 16): number {
  if (base <= 0) base = 16;
  return parseFloat((rem * base).toFixed(2));
}

export async function generateHash(text: string, algorithm: 'SHA-256' | 'SHA-512' | 'SHA-1'): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    return 'Web Crypto API unavailable in this environment';
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function decodeJWT(token: string) {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { isValid: false, error: 'JWT must consist of 3 dot-separated parts (header.payload.signature)' };
    }
    const header = JSON.parse(decodeBase64(parts[0]));
    const payload = JSON.parse(decodeBase64(parts[1]));
    let isExpired = false;
    let expirationDate = null;
    if (payload.exp) {
      expirationDate = new Date(payload.exp * 1000);
      isExpired = expirationDate.getTime() < Date.now();
    }

    return {
      isValid: true,
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature: parts[2],
      isExpired,
      expirationDate: expirationDate ? expirationDate.toUTCString() : null,
    };
  } catch (err: unknown) {
    return {
      isValid: false,
      error: err instanceof Error ? err.message : 'Failed to decode JWT token',
    };
  }
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function unescapeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export function testRegex(pattern: string, flags: string, testText: string) {
  try {
    const regex = new RegExp(pattern, flags);
    const matches: { match: string; index: number; groups?: Record<string, string> }[] = [];
    let match: RegExpExecArray | null;

    if (flags.includes('g')) {
      let count = 0;
      while ((match = regex.exec(testText)) !== null && count < 100) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups,
        });
        if (match[0].length === 0) regex.lastIndex++; // avoid infinite loop on empty match
        count++;
      }
    } else {
      match = regex.exec(testText);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups,
        });
      }
    }

    return {
      isValid: true,
      matches,
      matchCount: matches.length,
    };
  } catch (err: unknown) {
    return {
      isValid: false,
      error: err instanceof Error ? err.message : 'Invalid Regular Expression',
      matches: [],
      matchCount: 0,
    };
  }
}

export function formatSql(sql: string): string {
  if (!sql) return '';
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'JOIN', 'LEFT JOIN',
    'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'ON', 'LIMIT', 'OFFSET', 'UNION'
  ];
  
  let formatted = sql.replace(/\s+/g, ' ').trim();
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${kw}`);
  });
  return formatted.trim();
}
