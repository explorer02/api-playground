'use client';

import { useState, useCallback } from 'react';
import { highlight } from 'sugar-high';

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const html = highlight(code);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className={`absolute top-4 right-4 border border-white/10 rounded-md px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-all duration-200 z-1 ${copied ? 'bg-green-500 text-white' : 'bg-white/8 text-slate-400'}`}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="code-block-theme bg-slate-900 text-slate-300 rounded-2xl p-5 md:p-7 pr-20 text-[13px] leading-[1.8] overflow-x-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)] m-0">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
