'use client'

import { useState } from 'react'

interface SummarizeResponse {
  summary: string
  success: boolean
}

interface SummarizeError {
  error: string
}

export const useMemoSummarize = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const summarizeMemo = async (content: string): Promise<string | null> => {
    if (!content.trim()) {
      setError('메모 내용이 비어있습니다.')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      const data: SummarizeResponse | SummarizeError = await response.json()

      if (!response.ok) {
        throw new Error(
          (data as SummarizeError).error || '요약 생성에 실패했습니다.'
        )
      }

      const { summary } = data as SummarizeResponse
      return summary
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    summarizeMemo,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
