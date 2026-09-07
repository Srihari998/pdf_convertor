import { ToolMetadata } from '../types';

export const TOOLS_REGISTRY: ToolMetadata[] = [
  // ==========================================
  // 1. PDF TOOLS
  // ==========================================
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDF files into a single unified document in any order.',
    longDescription:
      'Merge two or more PDF files into a single, cohesive document directly in your browser. Drag and drop to rearrange page order, delete individual files, and download the combined PDF in seconds with zero data upload.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'Layers',
    keywords: ['merge pdf', 'combine pdf', 'join pdf', 'combine pdf files', 'merge pdf free'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Combine unlimited PDF documents into one file',
      'Drag-and-drop file reordering before merging',
      '100% private in-browser WebAssembly processing',
      'Preserves original document formatting and vector graphics',
    ],
    howToUse: [
      'Click or drag your PDF files into the upload box.',
      'Reorder the files by dragging or using the position buttons.',
      'Click "Merge PDF" to assemble the new document.',
      'Download your merged PDF file instantly.',
    ],
    faqs: [
      {
        question: 'Is there a limit on how many PDFs I can merge?',
        answer: 'You can merge up to 20 PDF files at once directly in your browser memory without any paywalls or registration.',
      },
      {
        question: 'Are my confidential documents uploaded to any server?',
        answer: 'No. DocumentNest executes 100% of the PDF merging logic locally inside your browser using client-side JavaScript. Your files never leave your computer.',
      },
    ],
    relatedToolIds: ['split-pdf', 'reorder-pdf', 'compress-pdf', 'pdf-editor'],
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    shortDescription: 'Separate PDF pages or extract custom page ranges into individual documents.',
    longDescription:
      'Split a multi-page PDF into single pages, extract custom ranges (e.g. 1-3, 5, 8-10), or export all pages into a neatly organized ZIP archive in seconds.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'Scissors',
    keywords: ['split pdf', 'separate pdf pages', 'extract pdf ranges', 'cut pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Split into individual one-page PDF files bundled in a ZIP',
      'Extract custom page ranges (e.g. 1-4, 7-10)',
      'Instant client-side generation without server lag',
    ],
    howToUse: [
      'Upload the PDF document you wish to split.',
      'Choose whether to split into individual pages or enter a custom page range.',
      'Click "Split PDF" to process.',
      'Download the split PDF or the complete ZIP package.',
    ],
    faqs: [
      {
        question: 'How do I specify custom page ranges?',
        answer: 'Enter comma-separated numbers and ranges like "1-3, 5, 7-9". The tool will extract only those specific pages into a new document.',
      },
    ],
    relatedToolIds: ['extract-pdf-pages', 'delete-pdf-pages', 'merge-pdf'],
  },
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    shortDescription: 'Reduce PDF file size while maintaining readability and visual clarity.',
    longDescription:
      'Optimize and downscale PDF streams and embedded graphics to reduce file size for email attachments and portal submissions.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'Minimize2',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf size reducer'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Selectable compression profiles (Recommended, Extreme, Low)',
      'Optimizes document dictionary and stream structures',
      'Shows live original vs compressed size comparison',
    ],
    howToUse: [
      'Upload your PDF file.',
      'Choose your desired compression level.',
      'Click "Compress PDF".',
      'Download your optimized PDF.',
    ],
    faqs: [
      {
        question: 'How much can a PDF be compressed in the browser?',
        answer: 'Compression depends on the internal contents. Documents with high-resolution images can see significant reductions, while text-only PDFs are already highly compact.',
      },
    ],
    relatedToolIds: ['compress-image', 'merge-pdf', 'pdf-to-jpg'],
  },
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    shortDescription: 'Rotate PDF pages 90°, 180°, or 270° clockwise or counter-clockwise.',
    longDescription:
      'Fix upside-down or sideways scans by rotating specific pages or all pages in your PDF document permanently.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'RotateCw',
    keywords: ['rotate pdf', 'turn pdf pages', 'rotate pdf 90 degrees', 'fix upside down pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Rotate all pages at once or specific page selections',
      '90° Clockwise, 180°, and 90° Counter-Clockwise options',
      'Permanent angle saving without re-rendering degradation',
    ],
    howToUse: [
      'Upload your PDF file.',
      'Select the rotation angle (90°, 180°, or 270°).',
      'Click "Rotate PDF" to apply.',
      'Download your perfectly oriented document.',
    ],
    faqs: [
      {
        question: 'Does rotating a PDF affect its text searchability?',
        answer: 'No. The rotation updates the internal viewport matrix metadata, preserving all selectable text, vector lines, and links.',
      },
    ],
    relatedToolIds: ['reorder-pdf', 'delete-pdf-pages', 'merge-pdf'],
  },
  {
    id: 'delete-pdf-pages',
    slug: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    shortDescription: 'Remove unwanted, blank, or sensitive pages from your PDF document.',
    longDescription:
      'Easily remove specific page numbers or ranges from any PDF file. Simply enter the page numbers you want gone and export the cleaned document.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'Trash2',
    keywords: ['delete pdf pages', 'remove pages from pdf', 'cut out pdf pages'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: false,
    features: [
      'Enter page numbers or ranges to remove (e.g. 2, 4-6)',
      'Live total page count detection',
      'Creates a clean output with remaining pages re-indexed',
    ],
    howToUse: [
      'Upload the PDF containing pages you want to delete.',
      'Type in the page numbers to remove.',
      'Click "Delete Pages & Export".',
      'Download the trimmed PDF document.',
    ],
    faqs: [
      {
        question: 'Can I undo a page deletion?',
        answer: 'Your original file on your computer remains untouched. A new PDF containing only the desired pages is generated for download.',
      },
    ],
    relatedToolIds: ['extract-pdf-pages', 'split-pdf', 'rotate-pdf'],
  },
  {
    id: 'extract-pdf-pages',
    slug: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    shortDescription: 'Extract selected pages from a document into a fresh, standalone PDF.',
    longDescription:
      'Pick the exact pages you need from a long report, book, or invoice and create a lightweight new PDF containing only your chosen pages.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'FileOutput',
    keywords: ['extract pdf pages', 'save specific pdf pages', 'extract pages from pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: false,
    features: [
      'Extract custom comma-separated page ranges',
      'Fast client-side sub-document generation',
      'Zero server upload required',
    ],
    howToUse: [
      'Upload your multi-page PDF.',
      'Enter the pages you want to extract (e.g. 1, 3, 5-8).',
      'Click "Extract Pages".',
      'Download your new custom PDF.',
    ],
    faqs: [
      {
        question: 'Can I extract pages in non-sequential order?',
        answer: 'Yes! If you enter "5, 2, 8", the generated PDF will contain pages in that exact specified order.',
      },
    ],
    relatedToolIds: ['split-pdf', 'delete-pdf-pages', 'reorder-pdf'],
  },
  {
    id: 'reorder-pdf',
    slug: 'reorder-pdf',
    name: 'Reorder PDF Pages',
    shortDescription: 'Rearrange and re-sequence the pages in your PDF file.',
    longDescription:
      'Organize the page order of your PDF document. Shift pages forward or backward, invert page sequences, or establish a custom numbering layout.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'ArrowDownUp',
    keywords: ['reorder pdf', 'rearrange pdf pages', 'change pdf page order', 'sort pdf pages'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: false,
    features: [
      'Move pages up/down with intuitive controls',
      'One-click reverse page order option',
      'Custom sequence mapping',
    ],
    howToUse: [
      'Upload your PDF file.',
      'Rearrange page order using the controls or sequence input.',
      'Click "Export Reordered PDF".',
      'Download your restructured document.',
    ],
    faqs: [
      {
        question: 'Can I reverse the entire page order?',
        answer: 'Yes! The tool includes a 1-click "Reverse Order" feature useful for scanned documents loaded back-to-front.',
      },
    ],
    relatedToolIds: ['rotate-pdf', 'merge-pdf', 'split-pdf'],
  },
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG / PNG',
    shortDescription: 'Convert every PDF page into high-resolution JPG or PNG images.',
    longDescription:
      'Render your PDF document pages into crisp, high-quality images. Download individual page images or package all pages into a convenient ZIP file.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'FileImage',
    keywords: ['pdf to jpg', 'pdf to png', 'convert pdf to image', 'pdf page to image'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Export to high-quality JPG or PNG formats',
      'Selectable rendering resolution (1x standard, 2x ultra-sharp)',
      '1-Click Download All as ZIP bundle',
    ],
    howToUse: [
      'Upload your PDF document.',
      'Select output image format (JPG or PNG) and quality.',
      'Click "Convert PDF to Images".',
      'Download images individually or as a single ZIP file.',
    ],
    faqs: [
      {
        question: 'What resolution are the extracted images?',
        answer: 'Images are rendered at high DPI (up to 300 DPI equivalent) to ensure razor-sharp text and graphics.',
      },
    ],
    relatedToolIds: ['jpg-to-pdf', 'image-to-pdf', 'compress-image'],
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    shortDescription: 'Convert multiple JPG, PNG, or WebP images into a single PDF document.',
    longDescription:
      'Transform photos, receipts, and graphic scans into a professional, shareable PDF. Customize page size (A4, Letter, Auto-Fit), orientation, and margins.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'FilePlus2',
    keywords: ['jpg to pdf', 'image to pdf', 'png to pdf', 'convert photos to pdf', 'make pdf from images'],
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp', 'image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 50,
    maxFiles: 30,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Support for JPG, PNG, and WebP image formats',
      'Configurable page sizes: A4, US Letter, or Fit to Image',
      'Portrait and Landscape orientation toggles',
      'Drag-and-drop image reordering',
    ],
    howToUse: [
      'Upload one or multiple image files.',
      'Set your preferred page size, orientation, and margin.',
      'Rearrange images into your desired order.',
      'Click "Create PDF" and download.',
    ],
    faqs: [
      {
        question: 'Can I combine multiple pictures into one PDF file?',
        answer: 'Yes! You can upload up to 30 photos at once, arrange them in order, and compile them into a multi-page PDF.',
      },
    ],
    relatedToolIds: ['pdf-to-jpg', 'merge-pdf', 'compress-pdf'],
  },
  {
    id: 'pdf-editor',
    slug: 'pdf-editor',
    name: 'PDF Editor',
    shortDescription: 'Add text annotations, draw signatures, insert shapes, and redact PDF pages.',
    longDescription:
      'An intuitive browser-based PDF annotation and editing studio. Add custom text notes, highlight sections, draw freehand signatures, and insert callout shapes with zero installation.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'PenTool',
    keywords: ['pdf editor', 'edit pdf online', 'annotate pdf', 'draw on pdf', 'sign pdf free'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Add editable text blocks with custom font size and color',
      'Draw freehand signatures and sketches',
      'Insert rectangle and highlight callout boxes',
      'Save and export updated PDF with annotations embedded',
    ],
    howToUse: [
      'Upload the PDF you want to annotate.',
      'Choose a tool: Text, Pen/Signature, Rectangle, or Highlight.',
      'Click or draw on the page canvas.',
      'Click "Save & Export PDF" to download.',
    ],
    faqs: [
      {
        question: 'Can I electronically sign documents with this tool?',
        answer: 'Yes! Use the Pen tool to draw your signature directly on your touch screen or with your mouse, position it, and export the signed document.',
      },
    ],
    relatedToolIds: ['watermark-pdf', 'page-numbers', 'metadata-editor'],
  },
  {
    id: 'watermark-pdf',
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    shortDescription: 'Add custom text watermarks across all pages of your PDF document.',
    longDescription:
      'Protect your documents from unauthorized use. Stamp "CONFIDENTIAL", "DRAFT", company names, or custom copyright text with customizable opacity, rotation angle, and font size.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'Stamp',
    keywords: ['watermark pdf', 'add watermark to pdf', 'confidential watermark', 'stamp pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: false,
    features: [
      'Custom watermark text and font size',
      'Diagonal (45°) or horizontal positioning',
      'Adjustable transparency/opacity slider',
      'Applies cleanly across every page in seconds',
    ],
    howToUse: [
      'Upload your PDF document.',
      'Type your watermark text (e.g. CONFIDENTIAL or SAMPLE).',
      'Adjust the opacity, font size, and rotation angle.',
      'Click "Apply Watermark" and download.',
    ],
    faqs: [
      {
        question: 'Does the watermark cover the text underneath?',
        answer: 'You can adjust the opacity slider so text remains fully legible beneath the watermark stamp.',
      },
    ],
    relatedToolIds: ['page-numbers', 'metadata-editor', 'pdf-editor'],
  },
  {
    id: 'page-numbers',
    slug: 'page-numbers',
    name: 'Add Page Numbers',
    shortDescription: 'Insert page numbering into PDF headers or footers with custom formats.',
    longDescription:
      'Add consistent, professional page numbers to your document. Choose positions (bottom-center, bottom-right, top-right), starting offset, and formatting styles (e.g. "Page X of Y").',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'Hash',
    keywords: ['add page numbers to pdf', 'number pdf pages', 'pdf pagination', 'page x of y pdf'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: false,
    features: [
      'Multiple numbering formats: "1, 2, 3" or "Page 1 of N"',
      'Top and Bottom alignment positions',
      'Configurable starting page number',
    ],
    howToUse: [
      'Upload your PDF file.',
      'Select position (Bottom Center, Bottom Right, Top Right).',
      'Choose numbering format and starting number.',
      'Click "Add Page Numbers" and download.',
    ],
    faqs: [
      {
        question: 'Can I start numbering from a specific number like page 5?',
        answer: 'Yes! Set the "Start Number" option to any integer to accommodate preface sections or book chapters.',
      },
    ],
    relatedToolIds: ['watermark-pdf', 'metadata-editor', 'merge-pdf'],
  },
  {
    id: 'metadata-editor',
    slug: 'metadata-editor',
    name: 'PDF Metadata Editor',
    shortDescription: 'View and edit document Title, Author, Subject, Keywords, and Creator.',
    longDescription:
      'Inspect and modify hidden PDF metadata properties for SEO indexing, professional presentation, or privacy clearing before distribution.',
    category: 'pdf',
    categorySlug: 'pdf',
    icon: 'Tag',
    keywords: ['pdf metadata editor', 'change pdf title', 'edit pdf author', 'view pdf properties'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: false,
    features: [
      'Edit Title, Author, Subject, Keywords, and Producer fields',
      'Option to strip all metadata for maximum privacy',
      'Instant client-side metadata preservation',
    ],
    howToUse: [
      'Upload your PDF file.',
      'View current metadata and enter updated details.',
      'Click "Save Metadata".',
      'Download your updated PDF.',
    ],
    faqs: [
      {
        question: 'Why should I edit PDF metadata?',
        answer: 'Search engines and PDF viewers read document titles from metadata rather than the file name. Cleaning metadata also removes personal author names before sharing.',
      },
    ],
    relatedToolIds: ['watermark-pdf', 'compress-pdf', 'pdf-editor'],
  },

  // ==========================================
  // 2. IMAGE TOOLS
  // ==========================================
  {
    id: 'compress-image',
    slug: 'compress-image',
    name: 'Compress Image',
    shortDescription: 'Compress JPG, PNG, and WebP images with custom quality and size limits.',
    longDescription:
      'Reduce the file size of your photos and graphics without visible loss of sharpness. Live side-by-side comparison showing exact kilobytes saved.',
    category: 'image',
    categorySlug: 'image',
    icon: 'ImageDown',
    keywords: ['compress image', 'compress png', 'compress jpg', 'reduce photo size', 'image optimizer'],
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp', 'image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 30,
    maxFiles: 10,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Supports JPG, PNG, and WebP compression',
      'Interactive quality slider with instant file size preview',
      'Max width and height downscaling option',
      'Batch download all compressed images as ZIP',
    ],
    howToUse: [
      'Upload one or more image files.',
      'Adjust the quality slider (e.g. 75% for ideal web optimization).',
      'Click "Compress Images".',
      'Download your optimized images individually or as a ZIP.',
    ],
    faqs: [
      {
        question: 'Does this tool support PNG transparency?',
        answer: 'Yes! PNG images retain full alpha channel transparency when compressed.',
      },
    ],
    relatedToolIds: ['resize-image', 'convert-image', 'image-to-pdf'],
  },
  {
    id: 'resize-image',
    slug: 'resize-image',
    name: 'Resize Image',
    shortDescription: 'Change image dimensions in pixels or percentages with aspect ratio lock.',
    longDescription:
      'Easily resize pictures to custom width and height dimensions or scale by percentage. Includes popular presets for YouTube, Instagram, LinkedIn, and email headers.',
    category: 'image',
    categorySlug: 'image',
    icon: 'Maximize',
    keywords: ['resize image', 'scale image', 'change photo dimensions', 'image resizer online'],
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp', 'image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 30,
    maxFiles: 10,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Custom pixel width & height controls',
      'Aspect ratio lock to prevent distortion',
      'Percentage scaling (e.g., 50%, 75%, 200%)',
    ],
    howToUse: [
      'Upload your image.',
      'Enter new width or height (aspect ratio is automatically maintained).',
      'Click "Resize Image".',
      'Download your resized graphic.',
    ],
    faqs: [
      {
        question: 'Will resizing stretch or distort my image?',
        answer: 'By default, the "Lock Aspect Ratio" toggle is enabled so your image scales proportionally without stretching.',
      },
    ],
    relatedToolIds: ['compress-image', 'convert-image', 'image-to-pdf'],
  },
  {
    id: 'convert-image',
    slug: 'convert-image',
    name: 'Convert Image',
    shortDescription: 'Convert images instantly between JPG, PNG, and WebP formats.',
    longDescription:
      'Fast browser-based image format converter. Convert heavy PNG graphics to lightweight WebP, or transform WebP files into universal JPG format with zero quality degradation.',
    category: 'image',
    categorySlug: 'image',
    icon: 'ArrowLeftRight',
    keywords: ['convert image', 'png to jpg', 'jpg to webp', 'webp to png', 'image format converter'],
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp', 'image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 30,
    maxFiles: 10,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Convert between JPG, PNG, and WebP seamlessly',
      'Batch conversion support for multiple photos',
      'Download converted files individually or as a ZIP archive',
    ],
    howToUse: [
      'Upload the images you want to convert.',
      'Select your target format: JPG, PNG, or WebP.',
      'Click "Convert All".',
      'Download your converted image files.',
    ],
    faqs: [
      {
        question: 'Why should I convert my images to WebP?',
        answer: 'WebP provides superior lossless and lossy compression, resulting in file sizes 25% to 35% smaller than comparable PNGs and JPGs.',
      },
    ],
    relatedToolIds: ['compress-image', 'resize-image', 'image-to-pdf'],
  },
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    shortDescription: 'Pack multiple photos, scans, and graphics into a multi-page PDF.',
    longDescription:
      'Compile photo collections, document screenshots, and receipts into a single clean PDF document with configurable page margins and layouts.',
    category: 'image',
    categorySlug: 'image',
    icon: 'FileStack',
    keywords: ['image to pdf', 'convert photo to pdf', 'combine pictures into pdf', 'png to pdf'],
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp', 'image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 50,
    maxFiles: 30,
    isClientSideOnly: true,
    popular: false,
    features: [
      'Accepts JPG, PNG, and WebP formats',
      'Reorder images before PDF compilation',
      'Select page orientation (Portrait or Landscape)',
    ],
    howToUse: [
      'Upload your image files.',
      'Choose page layout and margin preferences.',
      'Click "Generate PDF Document".',
      'Download your compiled PDF.',
    ],
    faqs: [
      {
        question: 'Is there a limit on how many images I can include?',
        answer: 'You can combine up to 30 photos in a single operation directly in your browser.',
      },
    ],
    relatedToolIds: ['jpg-to-pdf', 'pdf-to-jpg', 'compress-image'],
  },

  // ==========================================
  // 3. DOCUMENT & TEXT TOOLS
  // ==========================================
  {
    id: 'txt-to-pdf',
    slug: 'txt-to-pdf',
    name: 'TXT to PDF',
    shortDescription: 'Convert plain text (.txt) files or pasted notes into formatted PDF documents.',
    longDescription:
      'Turn plain text files, logs, and notepad notes into clean, paginated PDF documents with customizable font sizes, line spacing, and margins.',
    category: 'document',
    categorySlug: 'document',
    icon: 'FileType',
    keywords: ['txt to pdf', 'text to pdf', 'convert txt to pdf', 'plain text to pdf'],
    acceptedFileTypes: ['.txt', 'text/plain'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: false,
    features: [
      'Upload .txt file or paste raw text directly',
      'Automatic word wrapping and multi-page pagination',
      'Configurable typography and page margins',
    ],
    howToUse: [
      'Upload a text file or type/paste your content into the editor.',
      'Select your font size and margin preference.',
      'Click "Generate PDF".',
      'Download your formatted PDF.',
    ],
    faqs: [
      {
        question: 'Does it automatically break long text across multiple pages?',
        answer: 'Yes! The text engine calculates line metrics and inserts clean page breaks automatically.',
      },
    ],
    relatedToolIds: ['markdown-to-pdf', 'html-to-pdf', 'pdf-editor'],
  },
  {
    id: 'markdown-to-pdf',
    slug: 'markdown-to-pdf',
    name: 'Markdown to PDF',
    shortDescription: 'Render Markdown (.md) notes into beautifully styled PDF documents.',
    longDescription:
      'Transform GitHub-flavored Markdown documents into executive PDF reports. Supports headings, bold/italics, bullet lists, code blocks, blockquotes, and tables.',
    category: 'document',
    categorySlug: 'document',
    icon: 'FileCode2',
    keywords: ['markdown to pdf', 'md to pdf', 'convert markdown to pdf', 'export markdown pdf'],
    acceptedFileTypes: ['.md', '.markdown', '.txt', 'text/markdown', 'text/plain'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: true,
    features: [
      'GitHub-flavored Markdown parser with live HTML preview',
      'Supports code blocks, tables, lists, and headings',
      'Clean typography styling designed for reading',
    ],
    howToUse: [
      'Upload a Markdown file or type Markdown directly into the editor.',
      'Review the real-time rendered preview.',
      'Click "Export as PDF".',
      'Download your rendered PDF document.',
    ],
    faqs: [
      {
        question: 'Are code blocks formatted with syntax fonts?',
        answer: 'Yes! Code blocks and inline code are styled in monospace fonts with distinct background panels.',
      },
    ],
    relatedToolIds: ['txt-to-pdf', 'html-to-pdf', 'pdf-editor'],
  },
  {
    id: 'html-to-pdf',
    slug: 'html-to-pdf',
    name: 'HTML to PDF',
    shortDescription: 'Render HTML markup and CSS styling into printable PDF documents.',
    longDescription:
      'Convert raw HTML snippets, invoice templates, and styled markup into vector-accurate PDF pages directly in your browser.',
    category: 'document',
    categorySlug: 'document',
    icon: 'Code2',
    keywords: ['html to pdf', 'convert html to pdf', 'webpage to pdf', 'render html as pdf'],
    acceptedFileTypes: ['.html', '.htm', 'text/html'],
    maxFileSizeMB: 10,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: false,
    features: [
      'Supports standard HTML5 tags and inline CSS',
      'Live rendered preview frame',
      'Standard A4 and US Letter page export',
    ],
    howToUse: [
      'Upload an HTML file or paste your HTML code.',
      'Inspect the live rendering.',
      'Click "Convert to PDF".',
      'Download your output PDF.',
    ],
    faqs: [
      {
        question: 'Can I include CSS styling in my HTML?',
        answer: 'Yes! Both inline styles and `<style>` tags are rendered accurately.',
      },
    ],
    relatedToolIds: ['markdown-to-pdf', 'txt-to-pdf', 'pdf-editor'],
  },

  // ==========================================
  // 4. OCR TOOLS
  // ==========================================
  {
    id: 'image-to-text',
    slug: 'image-to-text',
    name: 'Image to Text OCR',
    shortDescription: 'Extract editable text from scanned photos, documents, and screenshots.',
    longDescription:
      'Optical Character Recognition (OCR) running 100% inside your browser via Tesseract.js. Extract text from receipts, book pages, and images without sending your personal paperwork to external cloud servers.',
    category: 'ocr',
    categorySlug: 'ocr',
    icon: 'ScanText',
    keywords: ['image to text', 'ocr online', 'extract text from image', 'photo to text', 'picture to text'],
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', 'image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 20,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Client-side machine learning OCR powered by WebAssembly',
      'Real-time recognition progress indicator',
      'One-click copy to clipboard and .txt file download',
      'Zero document upload to external servers',
    ],
    howToUse: [
      'Upload an image containing text.',
      'Click "Recognize & Extract Text".',
      'Watch the live recognition progress.',
      'Copy the extracted text or download as a .txt file.',
    ],
    faqs: [
      {
        question: 'Does this tool work on handwritten notes?',
        answer: 'Printed text, book pages, receipts, and clear digital screenshots yield the highest accuracy.',
      },
      {
        question: 'Is any image data sent to a cloud server?',
        answer: 'No! The OCR neural network model executes entirely inside your browser using WebAssembly. Your images stay on your device.',
      },
    ],
    relatedToolIds: ['pdf-to-text', 'txt-to-pdf', 'pdf-to-jpg'],
  },
  {
    id: 'pdf-to-text',
    slug: 'pdf-to-text',
    name: 'PDF to Text OCR',
    shortDescription: 'Extract searchable text from digital and scanned PDF documents.',
    longDescription:
      'Extract text layers from multi-page PDFs or run OCR across scanned document pages. Review recognized text, search contents, and export to a clean plain text file.',
    category: 'ocr',
    categorySlug: 'ocr',
    icon: 'ScanLine',
    keywords: ['pdf to text', 'pdf ocr', 'extract text from pdf', 'scanned pdf to text'],
    acceptedFileTypes: ['.pdf', 'application/pdf'],
    maxFileSizeMB: 30,
    maxFiles: 1,
    isClientSideOnly: true,
    popular: true,
    features: [
      'Multi-page text extraction with page separation',
      'Progress counter showing page-by-page progress',
      'Export full text transcript as a .txt document',
    ],
    howToUse: [
      'Upload your PDF document.',
      'Click "Extract Text".',
      'Review the recognized text for all pages.',
      'Copy to clipboard or download as a .txt file.',
    ],
    faqs: [
      {
        question: 'Can I extract text from multi-page documents?',
        answer: 'Yes! The tool processes all pages sequentially, showing a live progress bar as each page is analyzed.',
      },
    ],
    relatedToolIds: ['image-to-text', 'txt-to-pdf', 'split-pdf'],
  },
];

export function getToolBySlug(slug: string): ToolMetadata | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(category: string): ToolMetadata[] {
  return TOOLS_REGISTRY.filter((t) => t.category === category || t.categorySlug === category);
}

export function getPopularTools(): ToolMetadata[] {
  return TOOLS_REGISTRY.filter((t) => t.popular);
}

export function getRelatedTools(tool: ToolMetadata): ToolMetadata[] {
  return tool.relatedToolIds
    .map((id) => TOOLS_REGISTRY.find((t) => t.id === id || t.slug === id))
    .filter((t): t is ToolMetadata => t !== undefined);
}
