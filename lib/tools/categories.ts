import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'pdf',
    name: 'PDF Tools',
    slug: 'pdf',
    description: 'Merge, split, compress, rotate, edit, watermark, and convert PDF documents directly in your browser.',
    longDescription:
      'A comprehensive suite of free, client-side PDF utilities. Perform complex PDF merges, extractions, deletions, page numbering, and visual edits with 100% privacy and zero server uploads.',
    icon: 'FileText',
  },
  {
    id: 'image',
    name: 'Image Tools',
    slug: 'image',
    description: 'Compress, resize, convert, and pack images into PDF documents with custom dimensions and quality.',
    longDescription:
      'Lightning-fast image optimization and conversion utilities. Compress JPG, PNG, and WebP images, resize for social media, and generate professional PDF photo albums locally.',
    icon: 'ImageIcon',
  },
  {
    id: 'document',
    name: 'Document Tools',
    slug: 'document',
    description: 'Convert plain text, Markdown notes, and HTML code into clean, printable PDF documents.',
    longDescription:
      'Format and export your text, GitHub-flavored Markdown, and HTML templates into crisp, paginated PDF documents with custom typography and margins.',
    icon: 'BookOpen',
  },
  {
    id: 'ocr',
    name: 'OCR Tools',
    slug: 'ocr',
    description: 'Extract editable text from scanned documents, photos, and PDF files using browser-based machine learning.',
    longDescription:
      'Client-side optical character recognition (OCR) powered by Tesseract.js. Convert non-searchable PDF scans and images into searchable plain text without uploading sensitive paperwork to third parties.',
    icon: 'ScanText',
  },
];

export function getCategoryById(id: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.id === id || c.slug === id);
}
