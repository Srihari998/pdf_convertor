export type ToolCategory = 'pdf' | 'image' | 'document' | 'ocr';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolMetadata {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ToolCategory;
  categorySlug: string;
  icon: string;
  keywords: string[];
  acceptedFileTypes: string[]; // e.g. ['.pdf', 'application/pdf']
  maxFileSizeMB: number;
  maxFiles: number;
  isClientSideOnly: boolean;
  popular?: boolean;
  features: string[];
  howToUse: string[];
  faqs: FAQItem[];
  relatedToolIds: string[];
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  pageCount?: number;
}

export interface ProcessingProgress {
  percentage: number;
  statusText: string;
  currentStep?: number;
  totalSteps?: number;
}

export interface ProcessedOutputFile {
  blob: Blob;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface ProcessedResult {
  success: boolean;
  outputs: ProcessedOutputFile[];
  error?: string;
  stats?: {
    originalSize: number;
    processedSize: number;
    savedPercentage?: number;
    pageCount?: number;
    processingTimeMs?: number;
  };
}

export interface DocumentProcessor<InputOptions = any> {
  process(files: UploadedFileItem[], options?: InputOptions, onProgress?: (progress: ProcessingProgress) => void): Promise<ProcessedResult>;
}
