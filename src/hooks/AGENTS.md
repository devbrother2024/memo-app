# Hooks - AI Agent 지침서

## 모듈 역할

클라이언트 상태 관리를 위한 커스텀 React 훅 집합. 메모 CRUD, 검색, 필터링 로직을 캡슐화한다.

## 의존성 관계

- `@/types/memo` — Memo, MemoFormData 타입
- `@/utils/localStorage` — LocalStorage 유틸리티
- `@/utils/seedData` — 초기 샘플 데이터
- `uuid` — ID 생성

## 훅 목록

| 파일 | 역할 | 반환값 |
|------|------|--------|
| `useMemos.ts` | 메모 상태 전체 관리 | memos, CRUD 함수, 필터 함수, stats |

## useMemos 구조

```tsx
const {
  // 상태
  memos,              // 필터링된 메모 배열
  allMemos,           // 전체 메모 배열
  loading,            // 로딩 상태
  searchQuery,        // 현재 검색어
  selectedCategory,   // 선택된 카테고리
  stats,              // 통계 (total, byCategory, filtered)

  // CRUD
  createMemo,         // (formData) => Memo
  updateMemo,         // (id, formData) => void
  deleteMemo,         // (id) => void
  getMemoById,        // (id) => Memo | undefined

  // 필터링
  searchMemos,        // (query) => void
  filterByCategory,   // (category) => void

  // 유틸리티
  clearAllMemos,      // () => void
} = useMemos()
```

## Implementation Patterns

### 새 커스텀 훅 작성 템플릿

```tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

export const useCustomHook = (initialValue?: SomeType) => {
  const [state, setState] = useState<StateType>(initialValue)
  const [loading, setLoading] = useState(true)

  // 초기 로드
  useEffect(() => {
    // SSR 체크 후 브라우저 API 사용
    if (typeof window === 'undefined') return
    // 로직
    setLoading(false)
  }, [])

  // 메모이제이션된 함수
  const action = useCallback(() => {
    // 로직
  }, [dependencies])

  // 파생 상태
  const derivedState = useMemo(() => {
    return /* 계산 */
  }, [state])

  return {
    state,
    loading,
    action,
    derivedState,
  }
}
```

### 성능 최적화 패턴

1. **useCallback**: 자식 컴포넌트에 전달되는 함수
2. **useMemo**: 비용이 큰 계산 또는 객체/배열 생성
3. 의존성 배열 최소화

## Local Golden Rules

### Do's

- 훅 이름은 `use` 접두사 필수
- LocalStorage 접근은 `localStorageUtils` 통해서만
- 에러 처리: try-catch로 감싸고 console.error 로깅
- 로딩 상태 항상 제공

### Don'ts

- 훅 내부에서 직접 UI 렌더링 금지
- 조건부 훅 호출 금지 (React 규칙)
- 무한 루프 유발하는 의존성 배열 주의
- 훅 외부에서 useState/useEffect 호출 금지

## 확장 시 고려사항

새 기능 추가 시 useMemos 훅 확장 또는 별도 훅 생성:

- **useMemos 확장**: 메모 관련 기능 (정렬, 페이지네이션)
- **별도 훅 생성**: 독립적 기능 (useTheme, useToast 등)
