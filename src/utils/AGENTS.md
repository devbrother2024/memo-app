# Utils - AI Agent 지침서

## 모듈 역할

순수 유틸리티 함수 및 헬퍼 집합. 비즈니스 로직과 독립적인 재사용 가능한 기능을 제공한다.

## 의존성 관계

- `@/types/memo` — Memo 타입

## 유틸리티 목록

| 파일 | 역할 |
|------|------|
| `localStorage.ts` | LocalStorage CRUD 래퍼 |
| `seedData.ts` | 초기 샘플 데이터 시딩 |

## localStorage.ts 구조

```typescript
const localStorageUtils = {
  getMemos(): Memo[]              // 전체 메모 조회
  saveMemos(memos): void          // 전체 메모 저장
  addMemo(memo): void             // 메모 추가
  updateMemo(memo): void          // 메모 수정
  deleteMemo(id): void            // 메모 삭제
  searchMemos(query): Memo[]      // 메모 검색
  getMemosByCategory(cat): Memo[] // 카테고리 필터
  getMemoById(id): Memo | null    // 단건 조회
  clearMemos(): void              // 전체 삭제
}
```

## Implementation Patterns

### SSR 안전한 브라우저 API 접근

```typescript
export const browserUtil = {
  doSomething: (): ReturnType => {
    // SSR 환경 체크 필수
    if (typeof window === 'undefined') return defaultValue

    try {
      // 브라우저 API 사용
      return window.someApi()
    } catch (error) {
      console.error('Error:', error)
      return defaultValue
    }
  },
}
```

### 새 유틸리티 파일 작성 템플릿

```typescript
// 타입 import
import { SomeType } from '@/types/someType'

// 상수 정의
const STORAGE_KEY = 'app-key'

// 객체 형태로 관련 함수 그룹화
export const utilName = {
  method1: (param: ParamType): ReturnType => {
    // 구현
  },

  method2: (param: ParamType): ReturnType => {
    // 구현
  },
}
```

## Local Golden Rules

### Do's

- 모든 유틸리티는 순수 함수로 작성 (사이드 이펙트 최소화)
- SSR 환경 체크는 함수 최상단에서 수행
- 에러 발생 시 적절한 기본값 반환
- JSON 파싱/직렬화 시 try-catch 필수

### Don'ts

- React 훅 사용 금지 (유틸리티는 훅이 아님)
- 전역 상태 변경 금지
- 직접 DOM 조작 금지 (React에 위임)
- 비동기 함수에서 에러 무시 금지

## LocalStorage 키 관리

현재 사용 중인 키:
- `memo-app-memos` — 메모 데이터 저장

새 키 추가 시:
- 접두사 `memo-app-` 사용
- 상수로 정의하여 중앙 관리

## 테스트 고려사항

유틸리티 함수는 단위 테스트하기 용이함:
- 순수 함수는 입력 -> 출력 테스트
- LocalStorage 의존 함수는 모킹 필요
