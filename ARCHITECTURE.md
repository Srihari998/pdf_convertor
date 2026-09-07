# DocumentNest — Technical Architecture

This document describes the architectural design, privacy model, memory management, and future scalability of the DocumentNest platform.

---

## 1. Zero-Backend Client Processing Model

DocumentNest operates without a traditional application backend or database:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER RUNTIME                     │
│                                                             │
│  [File Input] ──► [ArrayBuffer / Blob]                     │
│                            │                                │
│                            ▼                                │
│                   [WebAssembly Engine]                      │
│                (pdf-lib / tesseract.js)                     │
│                            │                                │
│                            ▼                                │
│                [Local Output Blob URL]                      │
│                            │                                │
│                            ▼                                │
│                    [Browser Download]                       │
└─────────────────────────────────────────────────────────────┘
```

### Advantages:
1. **Zero Server Operating Cost:** No cloud compute costs (EC2, Lambda, Python workers) for file processing.
2. **Absolute Data Privacy:** User documents are never transmitted over the network.
3. **No Network Latency:** Merging and manipulating files happens at native CPU memory throughput.

---

## 2. Memory Management & Garbage Collection

Because heavy PDFs and OCR operations run in the browser:
- All generated `Blob` URLs are released using `URL.revokeObjectURL()` after download triggers.
- File references are cleared upon user reset to allow JavaScript engine garbage collection.
- File size thresholds (configurable in `lib/tools/registry.ts`) prevent out-of-memory errors on mobile devices.

---

## 3. Abstract Processing Engine for Future Backend Extensibility

The system defines standard processing interfaces in `lib/types.ts`:

```typescript
export interface DocumentProcessor<InputOptions = any> {
  process(
    files: UploadedFileItem[],
    options?: InputOptions,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<ProcessedResult>;
}
```

This allows future server-side AI or advanced conversions (such as high-fidelity PDF to DOCX/XLSX) to be connected as an `ApiProcessor` implementation without rewriting the UI or uploader components.
