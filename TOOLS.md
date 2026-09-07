# DocumentNest — Master Tool Catalog

A detailed index of all 22 working tools, supported formats, and client-side processing mechanisms.

---

## 1. PDF Tools (`/pdf`)

| Tool Slug | Tool Name | Accepted Inputs | Output Format | Processing Library |
| :--- | :--- | :--- | :--- | :--- |
| `merge-pdf` | Merge PDF | Multiple `.pdf` | Single `.pdf` | `pdf-lib` |
| `split-pdf` | Split PDF | Single `.pdf` | Multiple `.pdf` / `.zip` | `pdf-lib` + `jszip` |
| `compress-pdf` | Compress PDF | Single `.pdf` | Compressed `.pdf` | `pdf-lib` stream optimizer |
| `rotate-pdf` | Rotate PDF | Single `.pdf` | Rotated `.pdf` | `pdf-lib` |
| `delete-pdf-pages` | Delete PDF Pages | Single `.pdf` | Trimmed `.pdf` | `pdf-lib` |
| `extract-pdf-pages` | Extract PDF Pages | Single `.pdf` | Extracted `.pdf` | `pdf-lib` |
| `reorder-pdf` | Reorder PDF Pages | Single `.pdf` | Reordered `.pdf` | `pdf-lib` |
| `pdf-to-jpg` | PDF to JPG / PNG | Single `.pdf` | `.jpg`, `.png`, `.zip` | `pdf-lib` + Canvas + `jszip` |
| `jpg-to-pdf` | JPG to PDF | Multiple `.jpg`, `.png`, `.webp` | Single `.pdf` | `pdf-lib` |
| `pdf-editor` | PDF Editor | Single `.pdf` | Annotated `.pdf` | `pdf-lib` + Canvas |
| `watermark-pdf` | Watermark PDF | Single `.pdf` | Watermarked `.pdf` | `pdf-lib` |
| `page-numbers` | Add Page Numbers | Single `.pdf` | Paginated `.pdf` | `pdf-lib` |
| `metadata-editor` | PDF Metadata Editor | Single `.pdf` | Updated `.pdf` | `pdf-lib` |

---

## 2. Image Tools (`/image`)

| Tool Slug | Tool Name | Accepted Inputs | Output Format | Processing Library |
| :--- | :--- | :--- | :--- | :--- |
| `compress-image` | Compress Image | `.jpg`, `.png`, `.webp` | Compressed image | HTML5 Canvas API |
| `resize-image` | Resize Image | `.jpg`, `.png`, `.webp` | Resized image | HTML5 Canvas API |
| `convert-image` | Convert Image | `.jpg`, `.png`, `.webp` | Target format image | HTML5 Canvas API |
| `image-to-pdf` | Image to PDF | Multiple `.jpg`, `.png`, `.webp` | Single `.pdf` | `pdf-lib` |

---

## 3. Document & Text Tools (`/document`)

| Tool Slug | Tool Name | Accepted Inputs | Output Format | Processing Library |
| :--- | :--- | :--- | :--- | :--- |
| `txt-to-pdf` | TXT to PDF | `.txt` or raw text | Formatted `.pdf` | `pdf-lib` pagination engine |
| `markdown-to-pdf` | Markdown to PDF | `.md` or raw text | Formatted `.pdf` | `marked` + `pdf-lib` |
| `html-to-pdf` | HTML to PDF | `.html` or raw markup | Formatted `.pdf` | DOM Parser + `pdf-lib` |

---

## 4. Optical Character Recognition (`/ocr`)

| Tool Slug | Tool Name | Accepted Inputs | Output Format | Processing Library |
| :--- | :--- | :--- | :--- | :--- |
| `image-to-text` | Image to Text OCR | Scanned `.jpg`, `.png`, `.webp` | `.txt` text file | `tesseract.js` WebAssembly |
| `pdf-to-text` | PDF to Text OCR | Scanned/Digital `.pdf` | `.txt` text file | `tesseract.js` WebAssembly |
