export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export function countText(text: string): TextStats {
  if (!text) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const trimmed = text.trim();
  
  const words = trimmed ? (trimmed.match(/[\w\d\u00C0-\u024F\u1E00-\u1EFF]+/gu) || []).length : 0;
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length : 0;

  // Average reading speed: 200 words per minute; speaking speed: 130 words per minute
  const readingTimeMinutes = parseFloat((words / 200).toFixed(1));
  const speakingTimeMinutes = parseFloat((words / 130).toFixed(1));

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTimeMinutes,
    speakingTimeMinutes,
  };
}

export function convertCase(
  text: string,
  mode:
    | 'uppercase'
    | 'lowercase'
    | 'titlecase'
    | 'sentencecase'
    | 'camelcase'
    | 'pascalcase'
    | 'snakecase'
    | 'kebabcase'
): string {
  if (!text) return '';

  switch (mode) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      return text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
    case 'sentencecase':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case 'camelcase': {
      const words = text.match(/[a-zA-Z0-9]+/g) || [];
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join('');
    }
    case 'pascalcase': {
      const words = text.match(/[a-zA-Z0-9]+/g) || [];
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    }
    case 'snakecase': {
      const words = text.match(/[a-zA-Z0-9]+/g) || [];
      return words.map((w) => w.toLowerCase()).join('_');
    }
    case 'kebabcase': {
      const words = text.match(/[a-zA-Z0-9]+/g) || [];
      return words.map((w) => w.toLowerCase()).join('-');
    }
    default:
      return text;
  }
}

export function removeDuplicateLines(text: string, caseSensitive = true, trimLines = true): string {
  if (!text) return '';
  const lines = text.split(/\r\n|\r|\n/);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    const key = trimLines ? line.trim() : line;
    const compareKey = caseSensitive ? key : key.toLowerCase();
    if (!seen.has(compareKey)) {
      seen.add(compareKey);
      result.push(line);
    }
  }
  return result.join('\n');
}

export function removeExtraSpaces(text: string): string {
  if (!text) return '';
  return text
    .replace(/[ \t]+/g, ' ') // collapse multiple spaces and tabs
    .replace(/\n\s*\n\s*\n/g, '\n\n') // collapse multiple empty lines
    .trim();
}

export function sortLines(text: string, mode: 'az' | 'za' | 'length' | 'reverse' | 'natural'): string {
  if (!text) return '';
  const lines = text.split(/\r\n|\r|\n/);
  switch (mode) {
    case 'az':
      return lines.sort((a, b) => a.localeCompare(b)).join('\n');
    case 'za':
      return lines.sort((a, b) => b.localeCompare(a)).join('\n');
    case 'length':
      return lines.sort((a, b) => a.length - b.length).join('\n');
    case 'reverse':
      return lines.reverse().join('\n');
    case 'natural':
      return lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })).join('\n');
    default:
      return text;
  }
}

export function reverseText(text: string, mode: 'chars' | 'words' | 'lines'): string {
  if (!text) return '';
  switch (mode) {
    case 'chars':
      return text.split('').reverse().join('');
    case 'words':
      return text.split(/\s+/).reverse().join(' ');
    case 'lines':
      return text.split(/\r\n|\r|\n/).reverse().join('\n');
    default:
      return text;
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

export function generateLoremIpsum(count = 3, type: 'paragraphs' | 'sentences' | 'words' = 'paragraphs'): string {
  const baseWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel',
    'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut', 'orci', 'gravida',
    'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis',
    'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros', 'dictum', 'proin', 'accumsan', 'sapien'
  ];

  function getSentence() {
    const len = Math.floor(Math.random() * 8) + 6;
    const words = [];
    for (let i = 0; i < len; i++) {
      words.push(baseWords[Math.floor(Math.random() * baseWords.length)]);
    }
    const str = words.join(' ');
    return str.charAt(0).toUpperCase() + str.slice(1) + '.';
  }

  function getParagraph() {
    const sentences = [];
    const len = Math.floor(Math.random() * 4) + 4;
    for (let i = 0; i < len; i++) {
      sentences.push(getSentence());
    }
    return sentences.join(' ');
  }

  if (type === 'words') {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(baseWords[i % baseWords.length]);
    }
    return words.join(' ');
  }

  if (type === 'sentences') {
    const sentences = [];
    for (let i = 0; i < count; i++) {
      sentences.push(getSentence());
    }
    return sentences.join(' ');
  }

  const paragraphs = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(getParagraph());
  }
  return paragraphs.join('\n\n');
}

export function findAndReplace(text: string, find: string, replaceWith: string, caseSensitive = false, useRegex = false) {
  if (!text || !find) return { result: text, count: 0 };
  try {
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const count = (text.match(regex) || []).length;
    const result = text.replace(regex, replaceWith);
    return { result, count };
  } catch {
    return { result: text, count: 0 };
  }
}

export function getWordFrequency(text: string) {
  if (!text) return [];
  const words = text.toLowerCase().match(/[\w\d]+/g) || [];
  const counts: Record<string, number> = {};
  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([word, count]) => ({ word, count, percentage: parseFloat(((count / words.length) * 100).toFixed(1)) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}
