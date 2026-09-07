'use client';

import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  position?: 'top' | 'middle' | 'bottom' | 'native';
  className?: string;
}

export function AdSlot({ position = 'middle', className = '' }: AdSlotProps) {
  const nativeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (position === 'native' && nativeRef.current) {
      // Clear container and inject native ad script
      nativeRef.current.innerHTML = `
        <div id="container-6ad2dd96744a2d41993a7588d53dcd3e"></div>
      `;
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31226184.profitableratecpmnetwork.com/6ad2dd96744a2d41993a7588d53dcd3e/invoke.js';
      nativeRef.current.appendChild(script);
    }
  }, [position]);

  if (position === 'native') {
    return (
      <div className={`my-8 flex flex-col items-center justify-center p-2 text-center overflow-hidden ${className}`}>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">
          Sponsored Recommendations
        </span>
        <div ref={nativeRef} className="w-full flex justify-center min-h-[120px]" />
      </div>
    );
  }

  // Banner Ads (Desktop 728x90 vs Mobile 300x250)
  const desktopAdHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '4ba468a0419895bfe8d687983400c166',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/4ba468a0419895bfe8d687983400c166/invoke.js"></script>
      </body>
    </html>
  `;

  const mobileAdHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '0fca1f1dd409004b21b68c1ab3a2c18e',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/0fca1f1dd409004b21b68c1ab3a2c18e/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`my-8 flex flex-col items-center justify-center p-2 text-center overflow-hidden ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">
        Advertisement
      </span>

      {/* Desktop Banner (728x90) */}
      <div className="hidden md:flex justify-center w-full max-w-[728px] h-[90px] overflow-hidden rounded-xl bg-transparent">
        <iframe
          srcDoc={desktopAdHtml}
          width={728}
          height={90}
          title="Advertisement"
          scrolling="no"
          className="border-0 overflow-hidden"
        />
      </div>

      {/* Mobile Banner (300x250) */}
      <div className="flex md:hidden justify-center w-full max-w-[300px] h-[250px] overflow-hidden rounded-xl bg-transparent">
        <iframe
          srcDoc={mobileAdHtml}
          width={300}
          height={250}
          title="Advertisement"
          scrolling="no"
          className="border-0 overflow-hidden"
        />
      </div>
    </div>
  );
}
