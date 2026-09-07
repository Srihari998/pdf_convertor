# DocumentNest — Free Online PDF, Document & Image Utilities

> **Tagline:** Free Online PDF & Document Tools  
> **Production URL:** https://documentnest.vercel.app  
> **Hosting & Infrastructure Budget:** ₹0 (Deployable on Vercel Free Tier with zero server databases or paid APIs)

DocumentNest is a production-ready, client-side, privacy-first web application for editing, converting, merging, splitting, compressing, and managing PDF documents, images, and text notes.

---

## 🚀 Key Architectural Principles

- **100% Client-Side Processing:** All document merges, splits, watermarks, rotations, image conversions, and OCR run in the user's web browser using WebAssembly and HTML5 Canvas (`pdf-lib`, `tesseract.js`, `jszip`, `marked`).
- **Absolute Document Privacy:** Sensitive documents, contracts, and IDs never leave the user's device. No files are uploaded to any server.
- **₹0 Hosting Cost:** Engineered specifically for the Vercel free tier with static site generation (SSG) for all routes.
- **Zero Registration Required:** Instant access to all 22 working tools without account creation or daily quotas.
- **Mobile-First & Touchscreen Optimized:** Responsive across mobile phones, tablets, and desktop computers with Light and Dark themes.

---

## 🗂️ Complete Tool Suite (22 Working Utilities)

### 📄 1. PDF Tools (`/pdf`)
1. **Merge PDF (`/pdf/merge-pdf`):** Combine multiple PDF documents in custom sequence.
2. **Split PDF (`/pdf/split-pdf`):** Split into single pages or extract custom page ranges (e.g. `1-3, 5`).
3. **Compress PDF (`/pdf/compress-pdf`):** Stream and dictionary optimization for smaller file size.
4. **Rotate PDF (`/pdf/rotate-pdf`):** Rotate all or selected pages 90°, 180°, or 270°.
5. **Delete PDF Pages (`/pdf/delete-pdf-pages`):** Remove unwanted pages and export trimmed PDF.
6. **Extract PDF Pages (`/pdf/extract-pdf-pages`):** Extract specific pages into a standalone PDF.
7. **Reorder PDF Pages (`/pdf/reorder-pdf`):** Rearrange and sort page sequences.
8. **PDF to JPG / PNG (`/pdf/pdf-to-jpg`):** Render high-res images and export as ZIP.
9. **JPG to PDF (`/pdf/jpg-to-pdf`):** Convert multiple photos to PDF with A4, Letter, and Fit sizing.
10. **PDF Editor (`/pdf/pdf-editor`):** Add text annotations, highlight sections, and sign documents.
11. **Watermark PDF (`/pdf/watermark-pdf`):** Apply custom text watermarks with opacity and rotation.
12. **Add Page Numbers (`/pdf/page-numbers`):** Insert headers/footers with custom formats.
13. **PDF Metadata Editor (`/pdf/metadata-editor`):** Modify Title, Author, Subject, and Keywords.

### 🖼️ 2. Image Tools (`/image`)
14. **Compress Image (`/image/compress-image`):** Canvas compression for JPG, PNG, and WebP with live reduction stats.
15. **Resize Image (`/image/resize-image`):** Pixel and percentage resizing with aspect ratio lock.
16. **Convert Image (`/image/convert-image`):** Convert between JPG, PNG, and WebP formats.
17. **Image to PDF (`/image/image-to-pdf`):** Pack multiple image files into a multi-page PDF.

### 📝 3. Document Tools (`/document`)
18. **TXT to PDF (`/document/txt-to-pdf`):** Format plain text notes into paginated PDF pages.
19. **Markdown to PDF (`/document/markdown-to-pdf`):** Render GitHub-flavored Markdown into clean PDF documents.
20. **HTML to PDF (`/document/html-to-pdf`):** Convert HTML markup into printable PDF documents.

### 🔍 4. Optical Character Recognition (OCR) (`/ocr`)
21. **Image to Text OCR (`/ocr/image-to-text`):** Extract text from scans and photos via Tesseract.js WebAssembly.
22. **PDF to Text OCR (`/ocr/pdf-to-text`):** Extract text layers from digital and scanned PDFs.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with CSS Variables for Dark/Light mode
- **PDF Engine:** `pdf-lib`
- **OCR Engine:** `tesseract.js` (WebAssembly worker)
- **Archive Tool:** `jszip`
- **Markdown Engine:** `marked`
- **Icons:** Lucide React
- **Theming:** `next-themes`

---

## 💻 Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Unit Tests:**
   ```bash
   npx tsx tests/run-pdf-tests.ts
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🚀 Vercel Deployment

1. Push code to GitHub repository.
2. Import project into [Vercel](https://vercel.com).
3. Select Next.js preset.
4. Deploy! Zero environment variables or backend servers required.

---

## 📄 License

MIT License — Built for privacy, speed, and public utility.
