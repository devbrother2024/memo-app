# Types - AI Agent 지침서

## 모듈 역할

TypeScript 타입 및 인터페이스 정의. 애플리케이션 전체에서 사용되는 데이터 구조를 중앙 관리한다.

## 의존성 관계

- 독립적 (다른 모듈에 의존하지 않음)
- 모든 다른 모듈에서 import됨

## 현재 타입 정의

### memo.ts

```typescript
// 메모 엔티티
interface Memo {
  id: string          // UUID v4
  title: string       // 제목 (필수)
  content: string     // 내용 (필수)
  category: string    // 카테고리 키
  tags: string[]      // 태그 배열
  createdAt: string   // ISO 8601 문자열
  updatedAt: string   // ISO 8601 문자열
}

// 폼 데이터 (생성/수정용)
interface MemoFormData {
  title: string
  content: string
  category: string
  tags: string[]
}

// 카테고리 타입
type MemoCategory = 'personal' | 'work' | 'study' | 'idea' | 'other'

// 카테고리 레이블 매핑
const MEMO_CATEGORIES: Record<MemoCategory, string>

// 기본 카테고리 배열
const DEFAULT_CATEGORIES: MemoCategory[]
```

## Implementation Patterns

### 새 타입 추가 시

```typescript
// 1. 기본 인터페이스 정의
export interface EntityName {
  id: string
  // 필수 필드
}

// 2. 폼용 타입 (id, timestamps 제외)
export interface EntityFormData {
  // 사용자 입력 필드만
}

// 3. 상수 및 유니온 타입
export type EntityStatus = 'active' | 'archived' | 'deleted'

export const ENTITY_STATUSES: Record<EntityStatus, string> = {
  active: '활성',
  archived: '보관됨',
  deleted: '삭제됨',
}
```

### 타입 명명 규칙

- 인터페이스: PascalCase (예: `Memo`, `MemoFormData`)
- 타입 별칭: PascalCase (예: `MemoCategory`)
- 상수: SCREAMING_SNAKE_CASE (예: `MEMO_CATEGORIES`)

## Local Golden Rules

### Do's

- 모든 export는 named export 사용
- 관련 타입은 같은 파일에 그룹화
- 타입과 함께 관련 상수도 정의
- JSDoc 주석으로 복잡한 필드 설명

### Don'ts

- any 타입 사용 금지
- 런타임 로직 포함 금지 (타입만 정의)
- 순환 의존성 생성 금지
- 인터페이스와 타입 혼용 지양 (인터페이스 우선)

## 확장 가이드

새 엔티티 추가 시:

1. `src/types/` 디렉토리에 새 파일 생성 (예: `user.ts`)
2. 기본 인터페이스, 폼 타입, 상수 정의
3. 필요시 `index.ts`에서 re-export
