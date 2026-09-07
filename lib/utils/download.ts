import JSZip from 'jszip';
import { ProcessedOutputFile } from '../types';

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function createZipAndDownload(
  files: { blob: Blob; filename: string }[],
  zipFilename: string = 'documentnest-bundle.zip'
): Promise<void> {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.filename, file.blob);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(zipBlob, zipFilename);
}
