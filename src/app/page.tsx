'use client'

import { useState } from 'react'
import { useMemos } from '@/hooks/useMemos'
import { Memo, MemoFormData } from '@/types/memo'
import MemoList from '@/components/MemoList'
import MemoForm from '@/components/MemoForm'
import MemoDetailModal from '@/components/MemoDetailModal'

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
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleCreateMemo = async (formData: MemoFormData) => {
    const result = await createMemo(formData)
    if (result) {
      setIsFormOpen(false)
    } else {
      alert('메모 생성에 실패했습니다.')
    }
  }

  const handleUpdateMemo = async (formData: MemoFormData) => {
    if (editingMemo) {
      const success = await updateMemo(editingMemo.id, formData)
      if (success) {
        setEditingMemo(null)
      } else {
        alert('메모 수정에 실패했습니다.')
      }
    }
  }

  const handleEditMemo = (memo: Memo) => {
    setEditingMemo(memo)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingMemo(null)
  }

  const handleViewMemo = (memo: Memo) => {
    setSelectedMemo(memo)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedMemo(null)
  }

  const handleEditFromModal = (memo: Memo) => {
    setEditingMemo(memo)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
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
                onClick={() => setIsFormOpen(true)}
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

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemoList
          memos={memos}
          loading={loading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearchChange={searchMemos}
          onCategoryChange={filterByCategory}
          onEditMemo={handleEditMemo}
          onDeleteMemo={async (id: string) => {
            const success = await deleteMemo(id)
            if (!success) {
              alert('메모 삭제에 실패했습니다.')
            }
          }}
          onViewMemo={handleViewMemo}
          stats={stats}
        />
      </main>

      {/* 모달 폼 */}
      <MemoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingMemo ? handleUpdateMemo : handleCreateMemo}
        editingMemo={editingMemo}
      />

      {/* 메모 상세 보기 모달 */}
      <MemoDetailModal
        memo={selectedMemo}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onEdit={handleEditFromModal}
        onDelete={async (id: string) => {
          const success = await deleteMemo(id)
          if (!success) {
            alert('메모 삭제에 실패했습니다.')
          }
        }}
      />
    </div>
  )
}
