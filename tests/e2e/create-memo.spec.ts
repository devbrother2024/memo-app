import { test, expect } from '@playwright/test';

test.describe('새 메모 작성', () => {
  test('사용자는 새로운 메모를 작성할 수 있다', async ({ page }) => {
    // 1. 메인 페이지에 접속합니다.
    await page.goto('http://localhost:3000');

    // 기존 메모 개수 확인
    const statsLocator = page.locator('div').filter({ hasText: /^총 [0-9]+개의 메모$/ });
    const initialStatsText = await statsLocator.textContent();
    const initialMemoCount = initialStatsText ? parseInt(initialStatsText.match(/[0-9]+/)[0], 10) : 0;

    // 2. '새 메모' 버튼을 클릭하여 메모 작성 폼을 엽니다.
    await page.getByRole('button', { name: '새 메모' }).click();

    // 폼이 나타날 때까지 잠시 기다립니다.
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    const uniqueTitle = `새로운 메모 제목 ${Date.now()}`;

    // 3. '제목' 입력란에 "새로운 메모 제목"을 입력합니다.
    await page.getByLabel('제목 *').fill(uniqueTitle);

    // 4. '카테고리'를 '개인'으로 선택합니다.
    await page.getByLabel('카테고리').selectOption('personal');

    // 5. '내용' 입력란에 "새로운 메모 내용입니다."를 마크다운 형식으로 입력합니다.
    await page.getByRole('textbox', { name: /메모 내용을 마크다운으로 작성하세요/ }).fill('새로운 메모 내용입니다.');

    // 6. '태그' 입력란에 "테스트"와 "새메모"를 입력하고 추가합니다.
    const tagInput = page.getByPlaceholder('태그를 입력하고 Enter를 누르세요');
    await tagInput.fill('테스트');
    await page.keyboard.press('Enter');
    await tagInput.fill('새메모');
    await page.keyboard.press('Enter');

    // 태그가 추가되었는지 확인
    const form = page.locator('form');
    await expect(form.getByText('#테스트')).toBeVisible();
    await expect(form.getByText('#새메모')).toBeVisible();

    // 7. '저장하기' 버튼을 클릭합니다.
    await page.getByRole('button', { name: '저장하기' }).click();

    // 8. 메모 목록에 새로 추가된 "새로운 메모 제목" 카드가 나타나는지 확인합니다.
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    
    // 9. 통계 정보에서 총 메모 개수가 1 증가했는지 확인합니다.
    await expect(page.getByText(`총 ${initialMemoCount + 1}개의 메모`)).toBeVisible();
  });
});
