// src/components/MemoViewerModal.tsx
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Memo } from '../types/memo';

// MDEditor.Markdown를 동적으로 import (SSR 방지)
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface MemoViewerModalProps {
  memo: Memo;
  onClose: () => void;
  onEdit: (memo: Memo) => void;
  onDelete: (id: number) => void;
}

const MemoViewerModal: React.FC<MemoViewerModalProps> = ({ memo, onClose, onEdit, onDelete }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [onClose]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{memo.title}</h2>
        <div className="mb-6" data-color-mode="light">
          <MDEditor.Markdown 
            source={memo.content} 
            style={{ 
              whiteSpace: 'pre-wrap',
              backgroundColor: 'transparent',
              color: '#374151'
            }}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onEdit(memo)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            편집
          </button>
          <button
            onClick={() => onDelete(memo.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoViewerModal;
