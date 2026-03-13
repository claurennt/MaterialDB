'use client';

import { useState } from 'react';

export const CopyToClipboardButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className='relative inline-flex items-center justify-center'>
      <span
        aria-live='polite'
        className={`absolute -top-10 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs font-bold shadow-xl ${copied ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        {copied ? 'Copied to clipboard!' : ''}
      </span>

      <button
        onClick={handleCopy}
        className='p-1 px-3 text-xs font-medium hover:text-gray-400 text-[#BB86FC] bg-[#BB86FC]/10 rounded-md'
      >
        Copy
      </button>
    </div>
  );
};
