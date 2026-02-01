# Components - AI Agent 지침서

## 모듈 역할

재사용 가능한 React UI 컴포넌트 집합. 메모 앱의 모든 시각적 요소를 담당한다.

## 의존성 관계

- `@/types/memo` — Memo, MemoFormData 타입
- React hooks — useState, useEffect, useCallback

## 컴포넌트 목록

| 파일 | 역할 |
|------|------|
| `MemoForm.tsx` | 메모 생성/편집 모달 폼 |
| `MemoItem.tsx` | 개별 메모 카드 렌더링 |
| `MemoList.tsx` | 메모 목록 및 필터/검색 UI |

## Implementation Patterns

### 새 컴포넌트 작성 템플릿

```tsx
'use client'

import { useState } from 'react'

interface ComponentNameProps {
  // props 정의
}

export default function ComponentName({ ...props }: ComponentNameProps) {
  // 상태 및 로직

  return (
    <div className="...">
      {/* JSX */}
    </div>
  )
}
```

### Props 인터페이스 명명

- `{ComponentName}Props` 형식 사용
- 예: `MemoFormProps`, `MemoListProps`

### 이벤트 핸들러 명명

- `handle{Action}` 형식 (예: `handleSubmit`, `handleDelete`)
- 콜백 props는 `on{Action}` 형식 (예: `onClose`, `onSubmit`)

## Styling Guidelines

### Tailwind 클래스 우선순위

1. 레이아웃: `flex`, `grid`, `block`
2. 간격: `p-*`, `m-*`, `gap-*`
3. 크기: `w-*`, `h-*`, `max-w-*`
4. 색상: `bg-*`, `text-*`, `border-*`
5. 효과: `shadow-*`, `rounded-*`, `transition-*`

### 반응형 디자인

- 모바일 우선: 기본 스타일 -> `sm:` -> `md:` -> `lg:` -> `xl:`
- 공통 브레이크포인트: `sm:640px`, `md:768px`, `lg:1024px`

### 색상 팔레트 (현재 사용)

- Primary: `blue-600`, `blue-700` (hover)
- Background: `gray-50`, `white`
- Text: `gray-900` (제목), `gray-700` (본문), `gray-500` (보조)
- Border: `gray-200`, `gray-300`
- Category badges: 각 카테고리별 색상 (MemoItem 참조)

## Local Golden Rules

### Do's

- 모든 컴포넌트는 `'use client'` 명시
- Props에 대한 TypeScript 인터페이스 정의 필수
- 접근성: 버튼에 aria-label, 폼에 label 태그 연결
- 아이콘은 SVG inline 또는 heroicons 스타일 사용

### Don'ts

- 컴포넌트 내부에서 직접 LocalStorage 접근 금지 (hooks 또는 utils 사용)
- 하드코딩된 문자열 지양 (상수 또는 types에서 import)
- 컴포넌트 파일 500줄 초과 금지 (분리 필요)

## 테스트 고려사항

- Playwright E2E 테스트에서 요소 선택 용이하도록 `data-testid` 속성 추가 권장
- 예: `<button data-testid="submit-memo-btn">`
