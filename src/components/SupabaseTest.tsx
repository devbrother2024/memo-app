'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('테스트 중...')
  const [memos, setMemos] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // 환경변수 확인
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!url || !key) {
          setError('환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.')
          setConnectionStatus('❌ 환경변수 누락')
          return
        }

        console.log('Supabase URL:', url)
        console.log('Supabase Key exists:', !!key)

        const supabase = createClient()
        
        // 데이터베이스 연결 테스트
        const { data, error: fetchError } = await supabase
          .from('memos')
          .select('id, title, category, created_at')
          .limit(5)

        if (fetchError) {
          console.error('Supabase Error:', fetchError)
          setError(`데이터베이스 오류: ${fetchError.message}`)
          setConnectionStatus('❌ 연결 실패')
          return
        }

        console.log('Fetched data:', data)
        setMemos(data || [])
        setConnectionStatus('✅ 연결 성공')
        setError(null)

      } catch (err) {
        console.error('Connection test error:', err)
        setError(`연결 테스트 오류: ${err}`)
        setConnectionStatus('❌ 오류 발생')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">🔍 Supabase 연결 테스트</h2>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700">연결 상태:</p>
        <p className="text-lg">{connectionStatus}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700">환경변수 상태:</p>
        <ul className="text-sm text-gray-600 mt-1">
          <li>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 설정됨' : '❌ 누락'}</li>
          <li>SUPABASE_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 설정됨' : '❌ 누락'}</li>
        </ul>
      </div>

      {memos.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">데이터베이스에서 가져온 메모 ({memos.length}개):</p>
          <ul className="space-y-1">
            {memos.map((memo) => (
              <li key={memo.id} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                <strong>{memo.title}</strong> - {memo.category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}