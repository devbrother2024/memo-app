import { test, expect } from '@playwright/test'

test.describe('메모 생성 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 메인 페이지로 이동
    await page.goto('/')
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle')
  })

  test('정상 케이스: 새 메모를 성공적으로 작성할 수 있다', async ({ page }) => {
    // 1. "새 메모" 버튼 클릭
    await page.click('text=새 메모')
    
    // 2. 메모 작성 모달이 열리는지 확인
    await expect(page.locator('text=새 메모 작성')).toBeVisible()
    
    // 3. 제목 입력
    await page.fill('#title', '테스트 메모 제목')
    
    // 4. 카테고리 선택 (개인으로 기본 설정되어 있지만 명시적으로 확인)
    await page.selectOption('#category', 'personal')
    
    // 5. 내용 입력 (MDEditor에 입력)
    // MDEditor의 textarea 요소를 찾아서 입력
    await page.locator('.w-md-editor-text-textarea').fill('# 테스트 내용\n\n이것은 테스트 메모입니다.')
    
    // 6. 태그 입력
    await page.fill('input[placeholder*="태그를 입력하고"]', '테스트')
    await page.press('input[placeholder*="태그를 입력하고"]', 'Enter')
    
    // 7. 태그가 추가되었는지 확인
    await expect(page.locator('text=#테스트')).toBeVisible()
    
    // 8. "저장하기" 버튼 클릭
    await page.click('text=저장하기')
    
    // 9. 모달이 닫히고 메모 목록에 새 메모가 추가되었는지 확인
    await expect(page.locator('text=새 메모 작성')).not.toBeVisible()
    await expect(page.locator('text=테스트 메모 제목')).toBeVisible()
    
    // 10. 카테고리 태그와 해시태그가 표시되는지 확인
    await expect(page.locator('text=개인')).toBeVisible()
    await expect(page.locator('text=#테스트')).toBeVisible()
  })

  test('비정상 케이스: 제목을 입력하지 않으면 오류 메시지가 표시된다', async ({ page }) => {
    // 1. "새 메모" 버튼 클릭
    await page.click('text=새 메모')
    
    // 2. 내용만 입력하고 제목은 비움
    await page.locator('.w-md-editor-text-textarea').fill('내용만 있는 메모')
    
    // 3. "저장하기" 버튼 클릭
    await page.click('text=저장하기')
    
    // 4. 알럼 대화상자 처리
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('제목과 내용을 모두 입력해주세요')
      await dialog.accept()
    })
    
    // 5. 모달이 여전히 열려있는지 확인
    await expect(page.locator('text=새 메모 작성')).toBeVisible()
  })

  test('비정상 케이스: 내용을 입력하지 않으면 오류 메시지가 표시된다', async ({ page }) => {
    // 1. "새 메모" 버튼 클릭
    await page.click('text=새 메모')
    
    // 2. 제목만 입력하고 내용은 비움
    await page.fill('#title', '제목만 있는 메모')
    
    // 3. "저장하기" 버튼 클릭
    await page.click('text=저장하기')
    
    // 4. 알럼 대화상자 처리
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('제목과 내용을 모두 입력해주세요')
      await dialog.accept()
    })
    
    // 5. 모달이 여전히 열려있는지 확인
    await expect(page.locator('text=새 메모 작성')).toBeVisible()
  })

  test('취소 버튼 클릭 시 모달이 닫히고 메모가 생성되지 않는다', async ({ page }) => {
    // 기존 메모 개수 확인
    const initialMemoCount = await page.locator('[data-testid="memo-item"]').count()
    
    // 1. "새 메모" 버튼 클릭
    await page.click('text=새 메모')
    
    // 2. 일부 입력 수행
    await page.fill('#title', '취소될 메모')
    await page.locator('.w-md-editor-text-textarea').fill('취소될 내용')
    
    // 3. "취소" 버튼 클릭
    await page.click('text=취소')
    
    // 4. 모달이 닫혔는지 확인
    await expect(page.locator('text=새 메모 작성')).not.toBeVisible()
    
    // 5. 메모가 생성되지 않았는지 확인
    const finalMemoCount = await page.locator('[data-testid="memo-item"]').count()
    expect(finalMemoCount).toBe(initialMemoCount)
    
    // 6. 취소된 메모 제목이 목록에 없는지 확인
    await expect(page.locator('text=취소될 메모')).not.toBeVisible()
  })

  test('모달 외부 클릭 시 모달이 닫힌다', async ({ page }) => {
    // 1. "새 메모" 버튼 클릭
    await page.click('text=새 메모')
    
    // 2. 모달이 열렸는지 확인
    await expect(page.locator('text=새 메모 작성')).toBeVisible()
    
    // 3. 모달 배경 (overlay) 클릭
    await page.locator('.fixed.inset-0.bg-black.bg-opacity-50').click()
    
    // 4. 모달이 닫혔는지 확인
    await expect(page.locator('text=새 메모 작성')).not.toBeVisible()
  })

  test('태그 추가 및 제거 기능이 정상 작동한다', async ({ page }) => {
    // 1. "새 메모" 버튼 클릭
    await page.click('text=새 메모')
    
    // 2. 필수 필드 입력
    await page.fill('#title', '태그 테스트 메모')
    await page.locator('.w-md-editor-text-textarea').fill('태그 테스트 내용')
    
    // 3. 첫 번째 태그 추가
    await page.fill('input[placeholder*="태그를 입력하고"]', '태그1')
    await page.press('input[placeholder*="태그를 입력하고"]', 'Enter')
    await expect(page.locator('text=#태그1')).toBeVisible()
    
    // 4. 두 번째 태그를 "추가" 버튼으로 추가
    await page.fill('input[placeholder*="태그를 입력하고"]', '태그2')
    await page.click('text=추가')
    await expect(page.locator('text=#태그2')).toBeVisible()
    
    // 5. 첫 번째 태그 제거
    await page.locator('text=#태그1').locator('..').locator('button').click()
    await expect(page.locator('text=#태그1')).not.toBeVisible()
    
    // 6. 두 번째 태그는 여전히 존재하는지 확인
    await expect(page.locator('text=#태그2')).toBeVisible()
    
    // 7. 메모 저장
    await page.click('text=저장하기')
    
    // 8. 저장된 메모에 남은 태그가 표시되는지 확인
    await expect(page.locator('text=#태그2')).toBeVisible()
    await expect(page.locator('text=#태그1')).not.toBeVisible()
  })
})