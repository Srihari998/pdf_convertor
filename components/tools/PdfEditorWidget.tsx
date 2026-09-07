'use client';

import React, { useState, useEffect, useRef } from 'react';
import { annotatePdf } from '../../lib/pdf/engine';
import { UploadedFileItem, ProcessedResult, ProcessingProgress } from '../../lib/types';
import { FileProgress } from '../common/FileProgress';
import { ResultDownloadCard } from '../common/ResultDownloadCard';
import {
  Type,
  PenTool,
  Highlighter,
  Square,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  RotateCcw,
  Plus,
  AlertCircle,
} from 'lucide-react';

interface PdfEditorWidgetProps {
  file: File;
  onReset: () => void;
}

interface AnnotationItem {
  id: string;
  pageNumber: number;
  type: 'text' | 'signature' | 'highlight' | 'rectangle';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  text?: string;
  fontSize?: number;
  color?: { r: number; g: number; b: number };
  signatureDataUrl?: string;
  width?: number;
  height?: number;
}

export function PdfEditorWidget({ file, onReset }: PdfEditorWidgetProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTool, setActiveTool] = useState<'text' | 'signature' | 'highlight' | 'rectangle'>('text');
  
  // Tool options
  const [textInput, setTextInput] = useState('Approved');
  const [fontSize, setFontSize] = useState(18);
  const [textColor, setTextColor] = useState<{ r: number; g: number; b: number }>({ r: 0.1, g: 0.1, b: 0.1 });
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  
  // Progress & Result
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Signature canvas
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);
  const [hasDrawnSig, setHasDrawnSig] = useState(false);
  const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);

  // PDF Page Canvas
  const pageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<any>(null);

  // Load PDF.js and render current page
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      try {
        // @ts-ignore
        const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
        }

        const buffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        renderPage(1, pdf);
      } catch (e: any) {
        console.error(e);
        setError('Failed to load PDF preview in browser.');
      }
    }

    loadPdf();
    return () => {
      isCancelled = true;
    };
  }, [file]);

  const renderPage = async (pageNum: number, pdfInstance?: any) => {
    const pdf = pdfInstance || pdfDocRef.current;
    if (!pdf || !pageCanvasRef.current) return;

    try {
      const page = await pdf.getPage(pageNum);
      const canvas = pageCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const viewport = page.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx as any, viewport }).promise;
    } catch (e) {
      console.error(e);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      renderPage(newPage);
    }
  };

  // Canvas click handler to drop annotation
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const id = Date.now().toString();

    if (activeTool === 'text') {
      if (!textInput.trim()) return;
      setAnnotations((prev) => [
        ...prev,
        {
          id,
          pageNumber: currentPage,
          type: 'text',
          x,
          y,
          text: textInput,
          fontSize,
          color: textColor,
        },
      ]);
    } else if (activeTool === 'signature') {
      if (!sigDataUrl) {
        setError('Please draw a signature first in the Signature Pad below.');
        return;
      }
      setAnnotations((prev) => [
        ...prev,
        {
          id,
          pageNumber: currentPage,
          type: 'signature',
          x,
          y,
          signatureDataUrl: sigDataUrl,
          width: 140,
          height: 60,
        },
      ]);
    } else if (activeTool === 'highlight') {
      setAnnotations((prev) => [
        ...prev,
        {
          id,
          pageNumber: currentPage,
          type: 'highlight',
          x,
          y,
          width: 120,
          height: 24,
        },
      ]);
    } else if (activeTool === 'rectangle') {
      setAnnotations((prev) => [
        ...prev,
        {
          id,
          pageNumber: currentPage,
          type: 'rectangle',
          x,
          y,
          width: 120,
          height: 50,
        },
      ]);
    }
  };

  const removeAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  // Signature Pad drawing handlers
  const startSigDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawingSig(true);
    setHasDrawnSig(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const drawSig = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingSig) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopSigDraw = () => {
    if (isDrawingSig && sigCanvasRef.current) {
      setIsDrawingSig(false);
      setSigDataUrl(sigCanvasRef.current.toDataURL('image/png'));
    }
  };

  const clearSigPad = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSig(false);
    setSigDataUrl(null);
  };

  const handleExport = async () => {
    setError(null);
    setProgress({ percentage: 20, statusText: 'Applying annotations to PDF...' });

    try {
      const buffer = await file.arrayBuffer();
      const res = await annotatePdf(
        buffer,
        file.name,
        annotations,
        (p, s) => setProgress({ percentage: p, statusText: s })
      );
      setResult(res);
      setProgress(null);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to export annotated PDF.');
      setProgress(null);
    }
  };

  if (result) {
    return <ResultDownloadCard result={result} onReset={onReset} title="PDF Annotated & Saved!" />;
  }

  const pageAnnotations = annotations.filter((a) => a.pageNumber === currentPage);

  return (
    <div className="space-y-6">
      {/* Editor Tool Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'text', label: 'Add Text', icon: Type },
            { id: 'signature', label: 'Signature', icon: PenTool },
            { id: 'highlight', label: 'Highlight', icon: Highlighter },
            { id: 'rectangle', label: 'Box Shape', icon: Square },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTool(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTool === item.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Page Navigator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Tool Sub-Settings */}
      {activeTool === 'text' && (
        <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-500">Text Content:</span>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type text to place..."
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs font-semibold"
          />
          <span className="font-bold text-slate-500 ml-2">Font Size:</span>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs"
          >
            <option value={12}>12 pt</option>
            <option value={16}>16 pt</option>
            <option value={20}>20 pt</option>
            <option value={26}>26 pt</option>
            <option value={32}>32 pt</option>
          </select>

          <span className="font-bold text-slate-500 ml-2">Color:</span>
          <div className="flex gap-1.5">
            {[
              { label: 'Black', col: { r: 0.1, g: 0.1, b: 0.1 }, bg: 'bg-black' },
              { label: 'Blue', col: { r: 0.1, g: 0.3, b: 0.9 }, bg: 'bg-blue-600' },
              { label: 'Red', col: { r: 0.8, g: 0.1, b: 0.1 }, bg: 'bg-red-600' },
              { label: 'Green', col: { r: 0.1, g: 0.6, b: 0.2 }, bg: 'bg-emerald-600' },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setTextColor(c.col)}
                className={`w-5 h-5 rounded-full ${c.bg} cursor-pointer ring-2 ${
                  textColor.r === c.col.r ? 'ring-blue-500 scale-110' : 'ring-transparent'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium ml-auto">
            Click anywhere on page to place text
          </span>
        </div>
      )}

      {activeTool === 'signature' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Draw Your Signature:
            </span>
            <button
              type="button"
              onClick={clearSigPad}
              className="flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Pad</span>
            </button>
          </div>
          <canvas
            ref={sigCanvasRef}
            width={340}
            height={100}
            onMouseDown={startSigDraw}
            onMouseMove={drawSig}
            onMouseUp={stopSigDraw}
            onTouchStart={startSigDraw}
            onTouchMove={drawSig}
            onTouchEnd={stopSigDraw}
            className="w-full max-w-sm h-24 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 cursor-crosshair touch-none"
          />
          <p className="text-[11px] text-slate-500">
            Draw your signature above, then click anywhere on the PDF page to stamp it.
          </p>
        </div>
      )}

      {/* Interactive Page Viewport */}
      <div className="flex justify-center overflow-auto p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[650px]">
        <div
          ref={containerRef}
          onClick={handleCanvasClick}
          className="relative shadow-2xl rounded-lg overflow-hidden cursor-crosshair select-none inline-block"
        >
          <canvas ref={pageCanvasRef} className="block max-w-full h-auto" />

          {/* Render overlay annotations for current page */}
          {pageAnnotations.map((ann) => (
            <div
              key={ann.id}
              style={{
                position: 'absolute',
                left: `${ann.x}%`,
                top: `${ann.y}%`,
                transform: 'translate(-5%, -50%)',
              }}
              className="group pointer-events-auto"
            >
              {ann.type === 'text' && (
                <div
                  style={{
                    fontSize: `${ann.fontSize || 16}px`,
                    color: `rgb(${Math.round((ann.color?.r || 0) * 255)}, ${Math.round(
                      (ann.color?.g || 0) * 255
                    )}, ${Math.round((ann.color?.b || 0) * 255)})`,
                  }}
                  className="font-bold border border-transparent group-hover:border-blue-500 px-1 rounded-sm bg-white/70"
                >
                  {ann.text}
                </div>
              )}

              {ann.type === 'signature' && ann.signatureDataUrl && (
                <img
                  src={ann.signatureDataUrl}
                  alt="Signature"
                  className="w-32 h-14 object-contain border border-transparent group-hover:border-blue-500 bg-white/60 rounded-md"
                />
              )}

              {ann.type === 'highlight' && (
                <div className="w-28 h-5 bg-yellow-300/50 border border-yellow-400 rounded-xs" />
              )}

              {ann.type === 'rectangle' && (
                <div className="w-28 h-12 border-2 border-red-500 bg-transparent rounded-xs" />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAnnotation(ann.id);
                }}
                className="absolute -top-3 -right-3 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Annotations List */}
      {annotations.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Placed Annotations ({annotations.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {annotations.map((a, idx) => (
              <div
                key={a.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
              >
                <span>
                  Page {a.pageNumber}: {a.type} {a.text ? `("${a.text}")` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => removeAnnotation(a.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {progress && <FileProgress progress={progress} />}

      {/* Export Action */}
      {!progress && (
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Save &amp; Export PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
