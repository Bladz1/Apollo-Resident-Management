'use client';

import React from 'react';

type RichTextEditorProps = {
  editorRef: React.RefObject<HTMLDivElement | null>;
  handleEditorInput: () => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ editorRef, handleEditorInput }) => {
  const handleEditorCommand = (command: 'bold' | 'italic' | 'insertUnorderedList') => {
    if (typeof document === 'undefined') return;
    document.execCommand(command);
    handleEditorInput();
  };

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        Nội dung chi tiết <span className="text-red-500">*</span>
      </span>
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => handleEditorCommand('bold')}
          className="rounded border border-slate-200 bg-white px-3 py-1 text-xs font-bold hover:bg-slate-100"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => handleEditorCommand('italic')}
          className="rounded border border-slate-200 bg-white px-3 py-1 text-xs italic hover:bg-slate-100"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => handleEditorCommand('insertUnorderedList')}
          className="rounded border border-slate-200 bg-white px-3 py-1 text-xs hover:bg-slate-100"
        >
          List
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleEditorInput}
        className="min-h-[200px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
      />
    </div>
  );
};

export default RichTextEditor;
