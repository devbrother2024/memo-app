-- Seed data for memos table
INSERT INTO public.memos (title, content, category, tags)
VALUES
(
  '프로젝트 회의 준비',
  E'다음 주 월요일 오전 10시 프로젝트 킥오프 미팅을 위한 준비사항:\n\n- 프로젝트 범위 정의서 작성\n- 팀원별 역할 분담\n- 일정 계획 수립\n- 필요한 리소스 정리',
  'work',
  ARRAY['회의','프로젝트','준비']
),
(
  'React 18 새로운 기능 학습',
  E'# React 18 새로운 기능들\n\nReact 18에서 새로 추가된 주요 기능들을 정리했습니다.\n\n## 🚀 주요 기능들\n\n### 1. Concurrent Features\n- **자동 배칭**: 여러 상태 업데이트를 하나로 묶어서 처리\n- **Suspense 개선**: 데이터 fetching과 코드 스플리팅에서 더 나은 사용자 경험\n\n### 2. 새로운 Hooks\n\n#### useId\n```javascript\nimport { useId } from ''react'';\n\nfunction Component() {\n  const id = useId();\n  return <input id={id} />;\n}\n```\n\n#### useDeferredValue\n```javascript\nconst deferredQuery = useDeferredValue(query);\n```\n\n## 📅 학습 계획\n\n- [x] 공식 문서 읽기\n- [ ] 간단한 예제 프로젝트 만들기\n- [ ] 기존 프로젝트에 적용해보기\n\n> **참고**: 이번 주말에 집중적으로 학습 예정',
  'study',
  ARRAY['React','학습','개발']
),
(
  '새로운 앱 아이디어: 습관 트래커',
  E'매일 실천하고 싶은 습관들을 관리할 수 있는 앱:\n\n핵심 기능:\n- 습관 등록 및 관리\n- 일일 체크인\n- 진행 상황 시각화\n- 목표 달성 알림\n- 통계 분석\n\n기술 스택: React Native + Supabase\n출시 목표: 3개월 후',
  'idea',
  ARRAY['앱개발','습관','React Native']
),
(
  '주말 여행 계획',
  E'이번 주말 제주도 여행 계획:\n\n토요일:\n- 오전: 한라산 등반\n- 오후: 성산일출봉 관광\n- 저녁: 흑돼지 맛집 방문\n\n일요일:\n- 오전: 우도 관광\n- 오후: 쇼핑 및 기념품 구매\n- 저녁: 공항 이동\n\n준비물: 등산화, 카메라, 선크림',
  'personal',
  ARRAY['여행','제주도','주말']
),
(
  '독서 목록',
  E'올해 읽고 싶은 책들:\n\n개발 관련:\n- 클린 코드 (로버트 C. 마틴)\n- 리팩토링 2판 (마틴 파울러)\n- 시스템 디자인 인터뷰 (알렉스 쉬)\n\n자기계발:\n- 아토믹 해빗 (제임스 클리어)\n- 데일 카네기 인간관계론\n\n소설:\n- 82년생 김지영 (조남주)\n- 미드나잇 라이브러리 (매트 헤이그)',
  'personal',
  ARRAY['독서','책','자기계발']
),
(
  '성능 최적화 아이디어',
  E'# 웹 애플리케이션 성능 최적화 💡\n\n성능 최적화는 사용자 경험 향상의 핵심입니다.\n\n## 🎨 프론트엔드 최적화\n\n### 이미지 최적화\n- **WebP 포맷 사용**: 기존 JPEG/PNG 대비 25-35% 크기 감소\n- **Lazy Loading**: 뷰포트에 들어올 때만 로드\n- **Responsive Images**: 다양한 화면 크기에 맞는 이미지 제공\n\n### 코드 최적화\n```javascript\n// 코드 스플리팅 예시\nconst LazyComponent = lazy(() => import(''./LazyComponent''));\n\n// 번들 분석\nnpm run build -- --analyze\n```\n\n## ⚡ 백엔드 최적화\n\n| 방법 | 효과 | 구현 난이도 |\n|------|------|-------------|\n| 쿼리 최적화 | 높음 | 중간 |\n| CDN 활용 | 높음 | 낮음 |\n| 캐싱 전략 | 매우 높음 | 높음 |\n\n## 📊 모니터링\n\n> **Core Web Vitals 지표**\n> - **LCP**: 2.5초 이하\n> - **FID**: 100ms 이하  \n> - **CLS**: 0.1 이하\n\n### 도구 추천\n- **Lighthouse**: 성능 측정\n- **Web Vitals**: 실제 사용자 데이터\n- **Bundle Analyzer**: 번들 크기 분석',
  'idea',
  ARRAY['성능','최적화','웹개발']
)
ON CONFLICT DO NOTHING;
