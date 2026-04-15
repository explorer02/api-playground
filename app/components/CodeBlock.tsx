'use client';

import { useState, useCallback } from 'react';
import { highlight } from 'sugar-high';

const SH_THEME: Record<string, string> = {
  '--sh-class': '#8be9fd',
  '--sh-identifier': '#cbd5e1',
  '--sh-sign': '#94a3b8',
  '--sh-property': '#a5b4fc',
  '--sh-entity': '#f9a8d4',
  '--sh-jsxliterals': '#7dd3fc',
  '--sh-string': '#86efac',
  '--sh-keyword': '#c4b5fd',
  '--sh-comment': '#475569',
  '--sh-space': '',
};

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const html = highlight(code);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: copied ? '#22c55e' : 'rgba(255,255,255,0.08)',
          color: copied ? '#fff' : '#94a3b8',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6,
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 1,
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre
        style={{
          ...SH_THEME,
          background: '#0f172a',
          color: '#cbd5e1',
          borderRadius: 16,
          padding: '28px 32px',
          paddingRight: 80,
          fontSize: 13,
          lineHeight: 1.8,
          overflowX: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          margin: 0,
        } as React.CSSProperties}
      >
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
