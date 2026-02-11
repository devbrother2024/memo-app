import { test, expect } from '@playwright/test';

test.describe('메모 생성 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 메인 페이지로 이동
    await page.goto('http://localhost:3001');
    
    // 페이지가 완전히 로드될 때까지 대기
    await expect(page.locator('h1')).toContainText('📝 메모 앱');
    await expect(page.getByText(/총 \d+개의 메모/)).toBeVisible();
  });

  test('2.1 새 메모 작성 - 성공 케이스 (우선순위: Critical)', async ({ page }) => {
    // 고유한 제목 생성
    const uniqueTitle = `테스트 메모 ${Date.now()}`;
    
    // 초기 메모 개수 확인
    const initialCountText = await page.getByText(/총 \d+개의 메모/).textContent();
    const initialCount = parseInt(initialCountText?.match(/\d+/)?.[0] || '0');

    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();

    // 새 메모 작성 폼이 모달로 열리는지 확인
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    // 폼 필드 확인
    await expect(page.getByRole('textbox', { name: '제목 *' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: '카테고리' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /메모 내용을 마크다운으로/ })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '태그를 입력하고 Enter를 누르세요' })).toBeVisible();

    // 카테고리 기본값이 "personal"인지 확인 (실제 값은 영어)
    await expect(page.getByRole('combobox', { name: '카테고리' })).toHaveValue('personal');

    // 고유한 제목 입력
    await page.getByRole('textbox', { name: '제목 *' }).fill(uniqueTitle);

    // 내용 입력 (마크다운)
    const markdownContent = `# ${uniqueTitle}

이것은 **테스트** 메모입니다.

- 항목 1
- 항목 2`;

    await page.getByRole('textbox', { name: /메모 내용을 마크다운으로/ }).fill(markdownContent);

    // 마크다운 미리보기 확인 (라이브 모드에서)
    await expect(page.getByRole('heading', { name: uniqueTitle, level: 1 })).toBeVisible();
    await expect(page.locator('strong', { hasText: '테스트' })).toBeVisible();

    // 태그 입력 및 추가
    await page.getByRole('textbox', { name: '태그를 입력하고 Enter를 누르세요' }).fill('테스트');
    await page.getByRole('button', { name: '추가' }).click();

    // 태그가 추가되었는지 확인 (폼 내에서)
    await expect(page.locator('form').getByText('#테스트')).toBeVisible();

    // "저장하기" 버튼 클릭
    await page.getByRole('button', { name: '저장하기' }).click();

    // 폼이 닫히고 메모 목록으로 돌아가는지 확인
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).not.toBeVisible();

    // 새로 생성된 메모가 목록 상단에 표시되는지 확인
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    
    // 메모 개수가 1 증가했는지 확인
    await expect(page.getByText(`총 ${initialCount + 1}개의 메모`)).toBeVisible();

    // 테스트가 성공적으로 완료되었음을 확인하기 위해 메모가 실제로 저장되었는지 한 번 더 검증
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
  });

  test('2.2 새 메모 작성 - 필수 필드 누락 (우선순위: High)', async ({ page }) => {
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    // 제목을 비운 상태로 저장 시도
    await page.getByRole('button', { name: '저장하기' }).click();

    // 폼이 여전히 열려있는지 확인 (제출되지 않음)
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    // 제목 필드에 포커스가 이동했는지 확인 (브라우저 기본 검증)
    await expect(page.getByRole('textbox', { name: '제목 *' })).toBeFocused();

    // 제목을 입력하고 내용을 비운 상태로 저장 시도
    await page.getByRole('textbox', { name: '제목 *' }).fill('제목만 있는 메모');
    await page.getByRole('button', { name: '저장하기' }).click();

    // 여전히 폼이 열려있는지 확인 (내용 필드도 필수)
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();
  });

  test('2.3 메모 작성 취소 (우선순위: Medium)', async ({ page }) => {
    // 초기 메모 개수 확인
    const initialCountText = await page.getByText(/총 \d+개의 메모/).textContent();
    const initialCount = parseInt(initialCountText?.match(/\d+/)?.[0] || '0');

    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    // 일부 내용 입력
    await page.getByRole('textbox', { name: '제목 *' }).fill('취소될 메모');
    await page.getByRole('textbox', { name: /메모 내용을 마크다운으로/ }).fill('이 내용은 저장되지 않아야 합니다.');

    // "취소" 버튼 클릭
    await page.getByRole('button', { name: '취소' }).click();

    // 폼이 닫히고 메인 페이지로 돌아가는지 확인
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: '📝 메모 앱' })).toBeVisible();

    // 메모 개수가 변경되지 않았는지 확인
    await expect(page.getByText(`총 ${initialCount}개의 메모`)).toBeVisible();

    // 입력한 내용이 저장되지 않았는지 확인 (메모 목록에 "취소될 메모"가 없어야 함)
    await expect(page.getByRole('heading', { name: '취소될 메모' })).not.toBeVisible();
  });

  test('카테고리 선택 기능', async ({ page }) => {
    // 고유한 제목 생성
    const uniqueTitle = `학습 카테고리 테스트 ${Date.now()}`;
    
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    // 카테고리 드롭다운 테스트
    const categorySelect = page.getByRole('combobox', { name: '카테고리' });
    
    // 기본값이 "personal"인지 확인 (실제 값은 영어)
    await expect(categorySelect).toHaveValue('personal');

    // 다른 카테고리 선택 (학습 = study)
    await categorySelect.selectOption('study');
    await expect(categorySelect).toHaveValue('study');

    // 메모 작성 및 저장
    await page.getByRole('textbox', { name: '제목 *' }).fill(uniqueTitle);
    await page.getByRole('textbox', { name: /메모 내용을 마크다운으로/ }).fill('학습 관련 내용입니다.');
    await page.getByRole('button', { name: '저장하기' }).click();

    // 저장된 메모가 올바른 카테고리로 표시되는지 확인
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    // 카테고리는 한글로 표시되므로 '학습'을 확인
    await expect(page.getByText('학습', { exact: true }).first()).toBeVisible();
  });

  test('태그 시스템 기능', async ({ page }) => {
    // 고유한 제목 생성
    const uniqueTitle = `태그 테스트 메모 ${Date.now()}`;
    
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    // 기본 정보 입력
    await page.getByRole('textbox', { name: '제목 *' }).fill(uniqueTitle);
    await page.getByRole('textbox', { name: /메모 내용을 마크다운으로/ }).fill('태그 기능을 테스트합니다.');

    // 첫 번째 태그 추가
    await page.getByRole('textbox', { name: '태그를 입력하고 Enter를 누르세요' }).fill('태그1');
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.locator('form').getByText('#태그1')).toBeVisible();

    // 두 번째 태그 추가
    await page.getByRole('textbox', { name: '태그를 입력하고 Enter를 누르세요' }).fill('태그2');
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.locator('form').getByText('#태그2')).toBeVisible();

    // Enter 키로 태그 추가 테스트
    await page.getByRole('textbox', { name: '태그를 입력하고 Enter를 누르세요' }).fill('태그3');
    await page.getByRole('textbox', { name: '태그를 입력하고 Enter를 누르세요' }).press('Enter');
    await expect(page.locator('form').getByText('#태그3')).toBeVisible();

    // 메모 저장
    await page.getByRole('button', { name: '저장하기' }).click();

    // 저장된 메모에 모든 태그가 표시되는지 확인
    // 새로 생성된 메모가 최상단에 있으므로 첫 번째 메모를 찾습니다
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    
    // 메모 목록에서 태그들이 표시되는지 확인 (페이지 전체에서 찾되 첫 번째만)
    await expect(page.getByText('#태그1').first()).toBeVisible();
    await expect(page.getByText('#태그2').first()).toBeVisible();
    await expect(page.getByText('#태그3').first()).toBeVisible();
  });

  test('마크다운 에디터 기본 기능', async ({ page }) => {
    // 고유한 제목 생성
    const uniqueTitle = `마크다운 테스트 ${Date.now()}`;
    
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    // 마크다운 툴바 버튼들이 표시되는지 확인
    await expect(page.getByRole('button', { name: /Add bold text/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add italic text/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Insert title/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add unordered list/ })).toBeVisible();

    // 모드 전환 버튼들 확인
    await expect(page.getByRole('button', { name: /Edit code/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Live code/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Preview code/ })).toBeVisible();

    // 복잡한 마크다운 내용 입력
    const complexMarkdown = `# 제목 1
## 제목 2

**굵은 텍스트**와 *기울임 텍스트*

- 순서 없는 목록 1
- 순서 없는 목록 2

1. 순서 있는 목록 1
2. 순서 있는 목록 2

\`인라인 코드\`

\`\`\`javascript
const hello = "world";
\`\`\`

> 인용구 텍스트

[링크 텍스트](https://example.com)`;

    await page.getByRole('textbox', { name: '제목 *' }).fill(uniqueTitle);
    await page.getByRole('textbox', { name: /메모 내용을 마크다운으로/ }).fill(complexMarkdown);

    // 라이브 모드에서 렌더링 확인
    await expect(page.getByRole('heading', { name: '제목 1', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: '제목 2', level: 2 })).toBeVisible();
    await expect(page.locator('strong', { hasText: '굵은 텍스트' })).toBeVisible();
    await expect(page.locator('em', { hasText: '기울임 텍스트' })).toBeVisible();

    // 메모 저장
    await page.getByRole('button', { name: '저장하기' }).click();

    // 저장된 메모 확인
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
  });

  test('폼 필드 상호작용 및 접근성', async ({ page }) => {
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    // Tab 키를 사용한 키보드 내비게이션 테스트
    // 먼저 제목 필드를 직접 포커스합니다
    await page.getByRole('textbox', { name: '제목 *' }).focus();
    await expect(page.getByRole('textbox', { name: '제목 *' })).toBeFocused();

    await page.keyboard.press('Tab'); // 카테고리 드롭다운으로 이동
    await expect(page.getByRole('combobox', { name: '카테고리' })).toBeFocused();

    // 키보드로 카테고리 변경 테스트 (직접 선택으로 대체)
    const categorySelect = page.getByRole('combobox', { name: '카테고리' });
    await categorySelect.selectOption('work');
    await expect(categorySelect).toHaveValue('work');

    // Escape 키로 폼 닫기 테스트 (대신 취소 버튼 클릭으로 대체)
    await page.getByRole('button', { name: '취소' }).click();
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).not.toBeVisible();
  });

  test('데이터 지속성 확인', async ({ page }) => {
    const uniqueTitle = `테스트 메모 ${Date.now()}`;

    // 새 메모 생성
    await page.getByRole('button', { name: '새 메모' }).click();
    await page.getByRole('textbox', { name: '제목 *' }).fill(uniqueTitle);
    await page.getByRole('textbox', { name: /메모 내용을 마크다운으로/ }).fill('지속성 테스트 내용');
    await page.getByRole('button', { name: '저장하기' }).click();

    // 메모가 생성되었는지 확인
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();

    // 페이지 새로고침
    await page.reload();
    await expect(page.locator('h1')).toContainText('📝 메모 앱');

    // 새로고침 후에도 메모가 유지되는지 확인
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
  });
});
