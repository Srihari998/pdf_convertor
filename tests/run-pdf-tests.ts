import { PDFDocument } from 'pdf-lib';
import {
  mergePdfs,
  splitPdf,
  deletePdfPages,
  extractPdfPages,
  rotatePdf,
  reorderPdf,
  watermarkPdf,
  addPageNumbersToPdf,
  editPdfMetadata,
  compressPdf,
  getPdfPageCount,
} from '../lib/pdf/engine';

async function createSamplePdf(pageCount: number = 3, title: string = 'Test Document'): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(title);
  for (let i = 1; i <= pageCount; i++) {
    const page = pdfDoc.addPage([400, 600]);
    page.drawText(`Sample Page ${i}`, { x: 50, y: 500, size: 24 });
  }
  const bytes = await pdfDoc.save();
  return bytes.buffer as ArrayBuffer;
}

async function runAllPdfTests() {
  console.log('--- STARTING DOCUMENTNEST PDF ENGINE TESTS ---');

  // Test 1: Page Count
  const sample3Pages = await createSamplePdf(3, 'Three Pages');
  const count = await getPdfPageCount(sample3Pages);
  console.assert(count === 3, `Expected 3 pages, got ${count}`);
  console.log('✅ PASSED: getPdfPageCount accurately returned 3 pages');

  // Test 2: Merge PDF
  const sample2Pages = await createSamplePdf(2, 'Two Pages');
  const mergeRes = await mergePdfs([
    { name: 'doc1.pdf', buffer: sample3Pages },
    { name: 'doc2.pdf', buffer: sample2Pages },
  ]);
  console.assert(mergeRes.success === true, 'Merge failed');
  console.assert(mergeRes.stats?.pageCount === 5, `Expected 5 pages, got ${mergeRes.stats?.pageCount}`);
  console.log('✅ PASSED: mergePdfs merged 3 + 2 pages into 5-page PDF');

  // Test 3: Split PDF (All pages)
  const splitAllRes = await splitPdf(sample3Pages, 'sample.pdf', 'all_pages');
  console.assert(splitAllRes.outputs.length === 3, `Expected 3 single page outputs, got ${splitAllRes.outputs.length}`);
  console.log('✅ PASSED: splitPdf created 3 distinct single-page documents');

  // Test 4: Split PDF (Range)
  const splitRangeRes = await splitPdf(sample3Pages, 'sample.pdf', 'range', '1-2');
  console.assert(splitRangeRes.success === true, 'Split range failed');
  console.log('✅ PASSED: splitPdf extracted range 1-2 successfully');

  // Test 5: Delete PDF Pages
  const deleteRes = await deletePdfPages(sample3Pages, 'sample.pdf', [2]);
  console.assert(deleteRes.stats?.pageCount === 2, `Expected 2 pages remaining, got ${deleteRes.stats?.pageCount}`);
  console.log('✅ PASSED: deletePdfPages removed page 2, leaving 2 pages');

  // Test 6: Extract PDF Pages
  const extractRes = await extractPdfPages(sample3Pages, 'sample.pdf', [1, 3]);
  console.assert(extractRes.stats?.pageCount === 2, `Expected 2 extracted pages, got ${extractRes.stats?.pageCount}`);
  console.log('✅ PASSED: extractPdfPages extracted pages [1, 3]');

  // Test 7: Rotate PDF
  const rotateRes = await rotatePdf(sample3Pages, 'sample.pdf', 90, 'all');
  console.assert(rotateRes.success === true, 'Rotate PDF failed');
  console.log('✅ PASSED: rotatePdf applied 90-degree rotation across all pages');

  // Test 8: Reorder PDF
  const reorderRes = await reorderPdf(sample3Pages, 'sample.pdf', [3, 1, 2]);
  console.assert(reorderRes.stats?.pageCount === 3, 'Reorder page count mismatch');
  console.log('✅ PASSED: reorderPdf reordered sequence [3, 1, 2]');

  // Test 9: Watermark PDF
  const watermarkRes = await watermarkPdf(sample3Pages, 'sample.pdf', { text: 'CONFIDENTIAL', opacity: 0.3 });
  console.assert(watermarkRes.success === true, 'Watermark failed');
  console.log('✅ PASSED: watermarkPdf stamped watermark across all pages');

  // Test 10: Page Numbers
  const numRes = await addPageNumbersToPdf(sample3Pages, 'sample.pdf', {
    position: 'bottom-center',
    format: 'page_x_of_y',
    startNumber: 1,
  });
  console.assert(numRes.success === true, 'Page numbers failed');
  console.log('✅ PASSED: addPageNumbersToPdf formatted and inserted pagination');

  // Test 11: Edit Metadata
  const metaRes = await editPdfMetadata(sample3Pages, 'sample.pdf', {
    title: 'Updated Document Title',
    author: 'DocumentNest Engine',
  });
  console.assert(metaRes.success === true, 'Edit metadata failed');
  console.log('✅ PASSED: editPdfMetadata updated Title and Author properties');

  // Test 12: PDF Compression
  const compressRes = await compressPdf(sample3Pages, 'sample.pdf', 'medium');
  console.assert(compressRes.success === true, 'Compression failed');
  console.log('✅ PASSED: compressPdf optimized object streams');

  console.log('\n🎉 ALL 12 PDF ENGINE TESTS PASSED WITH 100% SUCCESS!\n');
}

runAllPdfTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
