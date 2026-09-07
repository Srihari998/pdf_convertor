'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, ArrowUp, ArrowDown, AlertCircle, Plus, Check } from 'lucide-react';
import { UploadedFileItem } from '../../lib/types';
import { formatBytes } from '../../lib/utils/formatters';

interface UniversalUploaderProps {
  acceptedTypes: string[];
  maxFileSizeMB: number;
  maxFiles: number;
  files: UploadedFileItem[];
  onFilesChange: (files: UploadedFileItem[]) => void;
  allowReorder?: boolean;
  label?: string;
  sublabel?: string;
}

export function UniversalUploader({
  acceptedTypes,
  maxFileSizeMB,
  maxFiles,
  files,
  onFilesChange,
  allowReorder = true,
  label = 'Drag & Drop your files here',
  sublabel = 'or click to browse from your device',
}: UniversalUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(Array.from(e.target.files));
    }
  };

  const processIncomingFiles = (incoming: File[]) => {
    setErrorMessage(null);
    const newItems: UploadedFileItem[] = [];

    if (files.length + incoming.length > maxFiles) {
      setErrorMessage(`You can upload a maximum of ${maxFiles} file(s) at once.`);
      return;
    }

    for (const file of incoming) {
      // Validate file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxFileSizeMB) {
        setErrorMessage(`"${file.name}" exceeds the maximum limit of ${maxFileSizeMB} MB.`);
        return;
      }

      // Check file extension
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAccepted =
        acceptedTypes.includes('*') ||
        acceptedTypes.some((t) => t.toLowerCase() === ext || t.toLowerCase() === file.type.toLowerCase());

      if (!isAccepted && acceptedTypes.length > 0) {
        setErrorMessage(`"${file.name}" format is not supported for this tool.`);
        return;
      }

      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

      newItems.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
      });
    }

    if (maxFiles === 1) {
      onFilesChange(newItems.slice(0, 1));
    } else {
      onFilesChange([...files, ...newItems]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    onFilesChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const reordered = [...files];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    onFilesChange(reordered);
  };

  const handleClearAll = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    onFilesChange([]);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:border-blue-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {label}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {sublabel}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 pt-2">
            <span>Max {maxFileSizeMB} MB per file</span>
            <span>•</span>
            <span>Up to {maxFiles} file(s)</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Selected Files ({files.length}{maxFiles > 1 ? `/${maxFiles}` : ''})
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                      <File className="w-5 h-5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                      {item.name}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {formatBytes(item.size)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {allowReorder && maxFiles > 1 && (
                    <>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                        aria-label="Move file up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === files.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                        aria-label="Move file down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    aria-label="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
