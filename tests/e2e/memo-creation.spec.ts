import { test, expect } from '@playwright/test';

/**
 * 시나리오 1: 메모 생성 (Critical)
 * 
 * 목적: 사용자가 새 메모를 성공적으로 생성할 수 있는지 확인
 * 파일: memo-management.md, 시나리오 1
 */

test.describe('메모 생성 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 전제조건: 브라우저가 http://localhost:3000에 접속되어 있음
    await page.goto('http://localhost:3000');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
    
    // localStorage 초기화 (깨끗한 상태에서 테스트 시작)
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('시나리오 1: 새 메모 생성 성공', async ({ page }) => {
    // 초기 상태 확인: "아직 메모가 없습니다" 메시지 표시
    await expect(page.getByText('아직 메모가 없습니다')).toBeVisible();
    await expect(page.getByText('총 0개의 메모')).toBeVisible();

    // 1. "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 메모 작성 폼이 표시되는지 확인
    await expect(page.getByHeading('새 메모 작성')).toBeVisible();

    // 2. 제목 필드에 "E2E 테스트 메모" 입력
    await page.getByRole('textbox', { name: '제목 *' }).fill('E2E 테스트 메모');

    // 3. 카테고리 드롭다운에서 "업무" 선택
    await page.getByLabel('카테고리').selectOption('업무');

    // 4. 마크다운 에디터에 테스트 내용 입력
    const markdownContent = `이것은 **E2E 테스트**를 위한 메모입니다.

## 테스트 항목
- 메모 생성 ✓
- 메모 편집
- 메모 삭제`;

    // 마크다운 에디터의 textarea 찾기 (여러 textarea가 있을 수 있으므로 구체적으로 지정)
    const markdownEditor = page.locator('textarea').first(); // 또는 더 구체적인 셀렉터 사용
    await markdownEditor.fill(markdownContent);

    // 5. 태그 입력 필드에 "e2e" 입력 후 "추가" 버튼 클릭
    await page.getByRole('textbox', { name: '태그를 입력하고 Enter를 누르세요' }).fill('e2e');
    await page.getByRole('button', { name: '추가' }).click();
    
    // 태그가 추가되었는지 확인
    await expect(page.getByText('#e2e')).toBeVisible();

    // 6. "저장하기" 버튼 클릭
    await page.getByRole('button', { name: '저장하기' }).click();

    // 예상 결과 검증
    
    // 메모 작성 폼이 닫힘 (새 메모 작성 헤딩이 사라짐)
    await expect(page.getByHeading('새 메모 작성')).not.toBeVisible();

    // 메인 화면에 새 메모가 표시됨
    await expect(page.getByRole('heading', { name: 'E2E 테스트 메모', level: 3 })).toBeVisible();

    // 메모 카운터가 "총 1개의 메모"로 업데이트됨
    await expect(page.getByText('총 1개의 메모')).toBeVisible();

    // 메모 제목이 올바르게 표시됨
    await expect(page.getByText('E2E 테스트 메모')).toBeVisible();

    // 카테고리가 올바르게 표시됨
    await expect(page.getByText('업무')).toBeVisible();

    // 작성일시가 표시됨 (현재 날짜 포함)
    const today = new Date();
    const currentYear = today.getFullYear();
    await expect(page.getByText(new RegExp(`${currentYear}년`))).toBeVisible();

    // 태그가 "#e2e"로 표시됨
    await expect(page.getByText('#e2e')).toBeVisible();

    // 마크다운 내용이 HTML로 렌더링되어 표시됨
    await expect(page.getByText('이것은')).toBeVisible();
    await expect(page.getByText('E2E 테스트', { exact: false })).toBeVisible();
    await expect(page.getByText('테스트 항목')).toBeVisible();
    await expect(page.getByText('메모 생성 ✓')).toBeVisible();

    // 마크다운 볼드 텍스트가 올바르게 렌더링됨
    await expect(page.locator('strong')).toContainText('E2E 테스트');
  });

  test('시나리오 1: 필수 필드 검증 - 제목 없음', async ({ page }) => {
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 제목은 입력하지 않고 내용만 입력
    await page.getByLabel('카테고리').selectOption('업무');
    await page.locator('textarea').first().fill('내용만 있는 메모');
    
    // "저장하기" 버튼 클릭
    await page.getByRole('button', { name: '저장하기' }).click();
    
    // 실패 조건: 필수 필드가 비어있을 때 저장되지 않음
    // 메모 작성 폼이 여전히 열려있어야 함
    await expect(page.getByHeading('새 메모 작성')).toBeVisible();
    
    // 메인 화면에 메모가 추가되지 않음
    await expect(page.getByText('총 0개의 메모')).toBeVisible();
  });

  test('시나리오 1: 필수 필드 검증 - 내용 없음', async ({ page }) => {
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 제목만 입력하고 내용은 입력하지 않음
    await page.getByRole('textbox', { name: '제목 *' }).fill('제목만 있는 메모');
    await page.getByLabel('카테고리').selectOption('업무');
    
    // "저장하기" 버튼 클릭
    await page.getByRole('button', { name: '저장하기' }).click();
    
    // 실패 조건: 필수 필드가 비어있을 때 저장되지 않음
    // 메모 작성 폼이 여전히 열려있어야 함
    await expect(page.getByHeading('새 메모 작성')).toBeVisible();
    
    // 메인 화면에 메모가 추가되지 않음
    await expect(page.getByText('총 0개의 메모')).toBeVisible();
  });

  test('시나리오 1: 메모 작성 취소 기능', async ({ page }) => {
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 일부 데이터 입력
    await page.getByRole('textbox', { name: '제목 *' }).fill('취소할 메모');
    
    // "취소" 버튼 클릭
    await page.getByRole('button', { name: '취소' }).click();
    
    // 메모 작성 폼이 닫힘
    await expect(page.getByHeading('새 메모 작성')).not.toBeVisible();
    
    // 메인 화면에 메모가 추가되지 않음
    await expect(page.getByText('총 0개의 메모')).toBeVisible();
    await expect(page.getByText('아직 메모가 없습니다')).toBeVisible();
  });

  test('시나리오 1: 다중 태그 추가', async ({ page }) => {
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 기본 정보 입력
    await page.getByRole('textbox', { name: '제목 *' }).fill('다중 태그 테스트');
    await page.getByLabel('카테고리').selectOption('업무');
    await page.locator('textarea').first().fill('다중 태그 테스트 내용');
    
    // 첫 번째 태그 추가
    await page.getByRole('textbox', { name: '태그를 입력하고 Enter를 누르세요' }).fill('태그1');
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.getByText('#태그1')).toBeVisible();
    
    // 두 번째 태그 추가
    await page.getByRole('textbox', { name: '태그를 입력하고 Enter를 누르세요' }).fill('태그2');
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.getByText('#태그2')).toBeVisible();
    
    // 저장
    await page.getByRole('button', { name: '저장하기' }).click();
    
    // 저장 후 두 태그 모두 표시되는지 확인
    await expect(page.getByText('#태그1')).toBeVisible();
    await expect(page.getByText('#태그2')).toBeVisible();
  });

  test('시나리오 1: 마크다운 미리보기 기능', async ({ page }) => {
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 기본 정보 입력
    await page.getByRole('textbox', { name: '제목 *' }).fill('마크다운 테스트');
    await page.getByLabel('카테고리').selectOption('업무');
    
    // 마크다운 내용 입력
    const markdownText = '# 제목\n\n**굵은 글씨**\n\n- 목록 항목 1\n- 목록 항목 2';
    await page.locator('textarea').first().fill(markdownText);
    
    // 미리보기 영역에서 렌더링된 결과 확인
    // (미리보기가 실시간으로 업데이트되는 경우)
    await expect(page.getByText('제목')).toBeVisible();
    await expect(page.locator('strong')).toContainText('굵은 글씨');
    
    // 저장
    await page.getByRole('button', { name: '저장하기' }).click();
    
    // 저장 후 메인 화면에서도 마크다운이 올바르게 렌더링되는지 확인
    await expect(page.getByText('제목')).toBeVisible();
    await expect(page.locator('strong')).toContainText('굵은 글씨');
  });
});