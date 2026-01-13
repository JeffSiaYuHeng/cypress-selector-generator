import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodePreviewProps {
  code: string;
  placeholder?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code, placeholder }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!code && placeholder) {
    return (
      <div className="w-full h-full min-h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/50 text-slate-500 p-6">
        <Terminal className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm font-medium">{placeholder}</p>
      </div>
    );
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-[#1e1e1e] shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">cypress_test.cy.ts</span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-cypress-green" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};