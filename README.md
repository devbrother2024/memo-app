# 📝 메모 앱 (Memo App)

Next.js + TypeScript 기반의 메모 애플리케이션

## 🚀 주요 기능

- ✅ 메모 CRUD (생성, 읽기, 수정, 삭제)
- 📂 카테고리별 분류 (개인, 업무, 학습, 아이디어, 기타)
- 🏷️ 태그 시스템
- 🔍 실시간 검색
- 📝 마크다운 편집기
- 🤖 AI 요약 기능 (Google Gemini)
- 💾 LocalStorage 저장

## 🛠 기술 스택

- **Framework**: Next.js 15.4.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Storage**: LocalStorage
- **AI**: Google Gemini API

## 📦 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정 (선택)
cp .env.example .env.local
# GEMINI_API_KEY 설정 (AI 요약 기능 사용 시)

# 개발 서버 실행
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── actions/         # Server Actions
│   ├── api/             # API Routes
│   └── page.tsx         # 메인 페이지
├── components/
│   ├── MemoForm.tsx     # 메모 생성/편집 폼
│   ├── MemoItem.tsx     # 개별 메모 카드
│   ├── MemoList.tsx     # 메모 목록
│   └── MemoDetailModal.tsx  # 상세 보기 모달
├── hooks/
│   ├── useMemos.ts      # 메모 관리 훅
│   └── useMemoSummarize.ts  # AI 요약 훅
├── types/
│   └── memo.ts          # 타입 정의
└── utils/
    ├── localStorage.ts  # LocalStorage 유틸
    └── seedData.ts      # 샘플 데이터
```

## 📄 라이선스

MIT License
