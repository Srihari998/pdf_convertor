'use client';

import React from 'react';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <div
      className={`my-6 flex flex-col items-center justify-center p-2 text-center overflow-hidden ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 block">
        Advertisement
      </span>
      <div className="w-full flex justify-center max-w-[728px] min-h-[90px] overflow-hidden rounded-xl">
        <iframe
          title="Sponsored Advertisement"
          width="728"
          height="90"
          scrolling="no"
          style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <base target="_blank" />
                <style>
                  body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
                </style>
              </head>
              <body>
                <script type="text/javascript">
                  atOptions = {
                    'key' : '027a2d4553c97b77be40c1e70ef95337',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="https://www.highrevenueformat.com/027a2d4553c97b77be40c1e70ef95337/invoke.js"></script>
              </body>
            </html>
          `}
        />
      </div>
    </div>
  );
}

export function AdRectangle({ className = '' }: { className?: string }) {
  return (
    <div
      className={`my-4 flex flex-col items-center justify-center p-2 text-center overflow-hidden ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 block">
        Advertisement
      </span>
      <div className="w-full flex justify-center max-w-[728px] min-h-[90px] overflow-hidden rounded-xl">
        <iframe
          title="Sponsored Advertisement"
          width="728"
          height="90"
          scrolling="no"
          style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <base target="_blank" />
                <style>
                  body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
                </style>
              </head>
              <body>
                <script type="text/javascript">
                  atOptions = {
                    'key' : '027a2d4553c97b77be40c1e70ef95337',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="https://www.highrevenueformat.com/027a2d4553c97b77be40c1e70ef95337/invoke.js"></script>
              </body>
            </html>
          `}
        />
      </div>
    </div>
  );
}

export function AdInContent({ className = '' }: { className?: string }) {
  return <AdBanner className={className} />;
}
