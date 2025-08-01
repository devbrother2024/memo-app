'use client'

import { useState } from 'react'
import { useMemos } from '@/hooks/useMemos'
import { Memo, MemoFormData } from '@/types/memo'
import MemoList from '@/components/MemoList'
import MemoForm from '@/components/MemoForm'
import MemoViewerModal from '@/components/MemoViewerModal'

export default function Home() {
  const {
    memos,
    loading,
    searchQuery,
    selectedCategory,
    stats,
    createMemo,
    updateMemo,
    deleteMemo,
    searchMemos,
    filterByCategory,
  } = useMemos()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null)

  // 뷰어 모달 상태 추가
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null)

  const handleCreateMemo = (formData: MemoFormData) => {
    createMemo(formData)
    setIsFormOpen(false)
  }

  const handleUpdateMemo = (formData: MemoFormData) => {
    if (editingMemo) {
      updateMemo(editingMemo.id, formData)
      setEditingMemo(null)
      setIsFormOpen(false)
    }
  }

  const handleEditMemo = (memo: Memo) => {
    setEditingMemo(memo)
    setSelectedMemo(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingMemo(null)
  }

  const handleViewMemo = (memo: Memo) => {
    setSelectedMemo(memo)
  }

  const handleCloseViewer = () => {
    setSelectedMemo(null)
  }

  const handleDeleteFromViewer = (id: string) => {
    deleteMemo(id)
    setSelectedMemo(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">📝 메모 앱</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setEditingMemo(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                새 메모
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemoList
          memos={memos}
          loading={loading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearchChange={searchMemos}
          onCategoryChange={filterByCategory}
          onEditMemo={handleEditMemo}
          onDeleteMemo={deleteMemo}
          onViewMemo={handleViewMemo}
          stats={stats}
        />
      </main>

      <MemoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingMemo ? handleUpdateMemo : handleCreateMemo}
        editingMemo={editingMemo}
      />

      {selectedMemo && (
        <MemoViewerModal
          memo={selectedMemo}
          onClose={handleCloseViewer}
          onEdit={handleEditMemo}
          onDelete={handleDeleteFromViewer}
        />
      )}
    </div>
  )
}