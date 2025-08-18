# E2E 테스트 시나리오 가이드

## 개요
메모 앱의 End-to-End(E2E) 테스트 시나리오 모음입니다. 이 문서들은 수동 테스트와 자동화 테스트 모두에 활용할 수 있습니다.

## 📁 문서 구조

```
tests/e2e/
├── README.md                           # 이 파일
├── scenarios/
│   ├── memo-management.md              # 핵심 메모 관리 기능 테스트
│   ├── ui-components.md                # UI 컴포넌트별 상세 테스트
│   └── error-and-edge-cases.md         # 에러 처리 및 엣지 케이스 테스트
```

## 🎯 테스트 범위

### 1. 핵심 기능 테스트 (memo-management.md)
- ✅ 메모 목록 조회
- ✅ 메모 생성 (새 메모 작성)
- ✅ 메모 상세 조회
- ✅ 메모 검색 및 필터링
- ✅ 메모 편집
- ✅ 메모 삭제
- ✅ 마크다운 에디터 기능
- ✅ 반응형 디자인
- ✅ 데이터 지속성
- ✅ 성능 테스트
- ✅ 접근성

### 2. UI 컴포넌트 테스트 (ui-components.md)
- ✅ 헤더 컴포넌트
- ✅ 검색 및 필터 컴포넌트
- ✅ 메모 카드 컴포넌트
- ✅ 메모 작성/편집 폼
- ✅ 마크다운 에디터
- ✅ 상세 모달
- ✅ 확인 다이얼로그
- ✅ 로딩 및 에러 상태

### 3. 에러 및 엣지 케이스 (error-and-edge-cases.md)
- ✅ 네트워크 관련 에러
- ✅ 데이터 관련 에러
- ✅ 입력 검증 에러
- ✅ UI/UX 엣지 케이스
- ✅ 브라우저 호환성
- ✅ 보안 관련 테스트
- ✅ 성능 극한 상황
- ✅ 복합 에러 시나리오

## 🚀 테스트 실행 방법

### 사전 준비
1. 개발 서버 실행
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

2. 브라우저에서 http://localhost:3001 접속 확인

3. 개발자 도구 준비 (F12)

### 수동 테스트 실행

#### 1단계: 기본 기능 테스트
```bash
# memo-management.md 문서를 참고하여 다음 순서로 테스트
1. 메모 목록 조회 (1.1)
2. 새 메모 작성 (2.1, 2.2, 2.3)
3. 메모 상세 보기 (3.1)
4. 검색 기능 (4.1, 4.2, 4.3)
5. 메모 편집 (5.1, 5.2)
6. 메모 삭제 (6.1, 6.2)
```

#### 2단계: UI 컴포넌트 테스트
```bash
# ui-components.md 문서를 참고하여 각 컴포넌트별 테스트
1. 헤더 컴포넌트 테스트
2. 검색/필터 컴포넌트 테스트
3. 메모 카드 인터랙션 테스트
4. 폼 컴포넌트 테스트
5. 마크다운 에디터 테스트
```

#### 3단계: 에러 및 엣지 케이스 테스트
```bash
# error-and-edge-cases.md 문서를 참고하여 예외 상황 테스트
1. 네트워크 오프라인 테스트
2. 잘못된 입력값 테스트
3. 극한 화면 크기 테스트
4. 보안 관련 테스트
```

### 자동화 테스트 (향후 구현)

#### Playwright 설정 예시
```javascript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3001',
    headless: false, // 디버깅 시 false
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
  ],
});
```

#### 테스트 스크립트 예시
```javascript
// tests/e2e/memo-crud.spec.ts
import { test, expect } from '@playwright/test';

test('메모 생성 및 조회', async ({ page }) => {
  await page.goto('/');
  
  // 새 메모 버튼 클릭
  await page.click('button:has-text("새 메모")');
  
  // 메모 정보 입력
  await page.fill('input[placeholder*="제목"]', '테스트 메모');
  await page.fill('textarea', '# 테스트 내용\n\n이것은 **테스트** 메모입니다.');
  
  // 저장
  await page.click('button:has-text("저장하기")');
  
  // 목록에서 확인
  await expect(page.locator('h3:has-text("테스트 메모")')).toBeVisible();
});
```

## 📊 테스트 우선순위

### Critical (최우선 - 반드시 통과해야 함)
- 메모 CRUD 기본 기능
- 데이터 지속성
- 마크다운 렌더링
- 폼 제출 및 검증

### High (높음 - 주요 기능)
- 검색 및 필터링
- 반응형 디자인
- 접근성 기본 요구사항
- 에러 처리

### Medium (보통 - 사용성 개선)
- 고급 마크다운 기능
- 성능 최적화
- 브라우저 호환성

### Low (낮음 - 추가 기능)
- 엣지 케이스 처리
- 고급 접근성 기능
- 성능 극한 테스트

## 🛠️ 테스트 도구 및 환경

### 필수 도구
- **Chrome DevTools**: 네트워크, 스토리지, 성능 테스트
- **Firefox Developer Tools**: 크로스 브라우저 호환성
- **Safari Web Inspector**: iOS/macOS 호환성
- **Lighthouse**: 성능 및 접근성 자동 검사

### 추천 확장 프로그램
- **axe DevTools**: 접근성 자동 검사
- **React Developer Tools**: React 컴포넌트 디버깅
- **ColorBlinding**: 색맹 시뮬레이션

### 테스트 환경
- **Desktop**: 1920×1080 (Chrome, Firefox, Safari, Edge)
- **Tablet**: 768×1024 (iPad 시뮬레이션)
- **Mobile**: 375×667 (iPhone SE 시뮬레이션)

## ✅ 테스트 체크리스트

### 릴리즈 전 필수 체크리스트

#### 🔥 Critical 기능 (100% 통과 필수)
- [ ] 메모 목록이 정상적으로 표시됨
- [ ] 새 메모 작성이 정상 동작함
- [ ] 메모 편집이 정상 동작함
- [ ] 메모 삭제가 정상 동작함
- [ ] 메모 상세 보기가 정상 동작함
- [ ] 브라우저 새로고침 후 데이터 유지됨
- [ ] 마크다운이 올바르게 렌더링됨
- [ ] 폼 검증이 정상 동작함

#### ⚡ High 기능 (90% 이상 통과)
- [ ] 검색 기능이 정상 동작함
- [ ] 카테고리 필터링이 정상 동작함
- [ ] 모바일에서 사용 가능함
- [ ] 키보드로 모든 기능 접근 가능함
- [ ] 에러 상황에서 적절한 메시지 표시됨
- [ ] 로딩 상태가 적절히 표시됨

#### 📱 반응형 디자인
- [ ] 모바일 (375px): 모든 기능 사용 가능
- [ ] 태블릿 (768px): 레이아웃 적절히 조정됨
- [ ] 데스크톱 (1920px): 최적의 사용자 경험

#### 🌐 브라우저 호환성
- [ ] Chrome (최신): 모든 기능 정상
- [ ] Firefox (최신): 모든 기능 정상
- [ ] Safari (최신): 모든 기능 정상
- [ ] Edge (최신): 모든 기능 정상

### 일일 테스트 체크리스트 (개발 중)

#### 🚀 스모크 테스트 (5분)
- [ ] 앱 로딩됨
- [ ] 메모 목록 표시됨
- [ ] 새 메모 작성 가능
- [ ] 기본 검색 동작함

#### 🔍 회귀 테스트 (15분)
- [ ] 기존 기능들이 여전히 동작함
- [ ] 새로 추가된 기능이 정상 동작함
- [ ] UI가 깨지지 않음
- [ ] 콘솔 에러 없음

## 🐛 버그 리포팅 가이드

### 버그 발견 시 기록할 정보
1. **재현 단계**: 정확한 단계별 설명
2. **예상 결과**: 어떻게 동작해야 하는지
3. **실제 결과**: 실제로 어떻게 동작했는지
4. **환경 정보**: 브라우저, OS, 화면 크기
5. **스크린샷**: 가능한 경우 시각적 증거
6. **콘솔 로그**: 에러 메시지가 있다면 포함

### 버그 우선순위
- **P1 (Blocker)**: 앱 사용 불가, 데이터 손실
- **P2 (Critical)**: 주요 기능 동작 안 함
- **P3 (Major)**: 일부 기능 문제, 사용성 저하
- **P4 (Minor)**: 사소한 UI 문제, 개선 사항

## 📈 테스트 메트릭스

### 성능 기준
- **페이지 로딩**: 3초 이내
- **메모 저장**: 1초 이내
- **검색 응답**: 500ms 이내
- **모달 열기**: 300ms 이내

### 접근성 기준
- **Lighthouse 접근성 점수**: 90점 이상
- **키보드 내비게이션**: 100% 지원
- **스크린 리더**: 모든 콘텐츠 읽기 가능
- **색상 대비**: WCAG AA 기준 준수

### 호환성 기준
- **브라우저 지원**: 최신 버전 기준 2년 이내
- **모바일 지원**: iOS 12+, Android 8+
- **화면 해상도**: 320px ~ 4K 지원

## 🔄 테스트 자동화 로드맵

### Phase 1: 기본 자동화
- [ ] Playwright 환경 설정
- [ ] Critical 기능 자동화
- [ ] CI/CD 파이프라인 통합

### Phase 2: 확장 자동화
- [ ] 시각적 회귀 테스트
- [ ] 성능 모니터링 자동화
- [ ] 크로스 브라우저 자동 테스트

### Phase 3: 고급 자동화
- [ ] AI 기반 테스트 생성
- [ ] 실시간 모니터링
- [ ] 자동 버그 리포팅

## 📚 참고 자료

### 테스트 베스트 프랙티스
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Playwright Documentation](https://playwright.dev/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### 도구 문서
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## 🤝 기여 방법

### 새로운 테스트 시나리오 추가
1. 해당 카테고리의 마크다운 파일 수정
2. 테스트 목적과 단계 명확히 기술
3. 예상 결과와 실패 조건 정의
4. 우선순위와 예상 실행 시간 설정

### 기존 시나리오 개선
1. 불분명한 단계나 설명 개선
2. 누락된 엣지 케이스 추가
3. 자동화를 위한 셀렉터 정보 추가
4. 실제 테스트 결과 반영

---

**마지막 업데이트**: 2025년 1월 18일  
**문서 버전**: 1.0.0  
**테스트 대상 앱 버전**: 메모 앱 v1.0.0
