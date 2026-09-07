'use client';

import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  position?: 'top' | 'middle' | 'bottom' | 'native';
  className?: string;
}

export function AdSlot({ position = 'middle', className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous ad nodes
    container.innerHTML = '';

    if (position === 'native') {
      // Native Ad Unit
      const nativeDiv = document.createElement('div');
      nativeDiv.id = 'container-6ad2dd96744a2d41993a7588d53dcd3e';
      container.appendChild(nativeDiv);

      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31226184.profitableratecpmnetwork.com/6ad2dd96744a2d41993a7588d53dcd3e/invoke.js';
      container.appendChild(script);
      return;
    }

    // Banner Ads (728x90 on Desktop >= 768px, 300x250 on Mobile < 768px)
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const key = isDesktop ? '4ba468a0419895bfe8d687983400c166' : '0fca1f1dd409004b21b68c1ab3a2c18e';
    const width = isDesktop ? 728 : 300;
    const height = isDesktop ? 90 : 250;

    const iframe = document.createElement('iframe');
    iframe.width = width.toString();
    iframe.height = height.toString();
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block';
    iframe.style.margin = '0 auto';
    iframe.scrolling = 'no';
    iframe.title = 'Advertisement';

    container.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '${key}',
                  'format' : 'iframe',
                  'height' : ${height},
                  'width' : ${width},
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://www.highrevenueformat.com/${key}/invoke.js"></script>
            </body>
          </html>
        `);
        doc.close();
      }
    } catch (err) {
      console.warn('Ad frame injection error:', err);
    }
  }, [position]);

  return (
    <div className={`my-8 flex flex-col items-center justify-center p-2 text-center overflow-hidden ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">
        {position === 'native' ? 'Sponsored Recommendations' : 'Advertisement'}
      </span>
      <div
        ref={containerRef}
        className="w-full flex justify-center items-center min-h-[90px] overflow-hidden"
      />
    </div>
  );
}
