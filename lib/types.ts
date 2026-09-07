export type ToolCategory =
  | 'student'
  | 'finance'
  | 'converters'
  | 'developer'
  | 'text'
  | 'date-time'
  | 'calculators'
  | 'health';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  shortName: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolMetadata {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  categorySlug: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  keywords: string[];
  popular?: boolean;
  featured?: boolean;
  formula?: {
    expression: string;
    description: string;
    variables?: { name: string; description: string }[];
  };
  howToUse: string[];
  example?: {
    input: string;
    output: string;
    explanation: string;
  };
  interpretation?: string;
  faqs: FAQItem[];
  relatedToolIds: string[];
  disclaimer?: string;
}
