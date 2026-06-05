import { test, expect } from '@playwright/test';

test.describe('Bingo Helper Tool E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
  });

  test('should display board, enter edit mode, paste numbers, mark cells, win lines, and undo', async ({
    page
  }) => {
    // 1. Initial State
    const activeBoardName = page.locator('.active-board-name');
    await expect(activeBoardName).toBeVisible();

    const modeBadge = page.locator('.mode-badge');
    await expect(modeBadge).toHaveText('Play Mode');

    // 2. Enter Edit Mode
    const editBtn = page.getByRole('button', { name: 'Edit Board' });
    await editBtn.click();
    await expect(modeBadge).toHaveText('Edit Mode');

    // 3. Paste 25 numbers into Textarea
    const textarea = page.locator('.paste-textarea');
    await expect(textarea).toBeVisible();

    const numbersList = Array.from({ length: 25 }, (_, i) => String(i + 1)).join(' ');
    await textarea.fill(numbersList);
    // Note: input listener clears the textarea after parsing
    await expect(textarea).toHaveValue('');

    // Check cells values in edit mode inputs
    const cell0Input = page.locator('input[data-index="0"]');
    const cell24Input = page.locator('input[data-index="24"]');
    await expect(cell0Input).toHaveValue('01');
    await expect(cell24Input).toHaveValue('25');

    // 4. Exit Edit Mode
    const exitBtn = page.getByRole('button', { name: 'Exit Edit' });
    await exitBtn.click();
    await expect(modeBadge).toHaveText('Play Mode');

    // Verify cell contents in play mode
    const cells = page.locator('.grid-cell');
    await expect(cells.first()).toContainText('01');
    await expect(cells.nth(24)).toContainText('25');

    // 5. Mark a line of 5 to trigger Bingo line highlight
    // Mark indices 0, 1, 2, 3, 4 (First Row)
    for (let i = 0; i < 5; i++) {
      await cells.nth(i).click();
      await expect(cells.nth(i)).toHaveClass(/marked/);
    }

    // Verify all 5 cells in the row are highlighted as winners
    for (let i = 0; i < 5; i++) {
      await expect(cells.nth(i)).toHaveClass(/winning-highlight/);
    }

    // 6. Test Undo
    const undoBtn = page.getByRole('button', { name: 'Undo' });
    await undoBtn.click();

    // The last toggled cell (index 4) should revert to unmarked and not winning
    await expect(cells.nth(4)).not.toHaveClass(/marked/);
    await expect(cells.nth(4)).not.toHaveClass(/winning-highlight/);
    // The others (0,1,2,3) should stay marked but not highlighted (since line is incomplete)
    await expect(cells.first()).toHaveClass(/marked/);
    await expect(cells.first()).not.toHaveClass(/winning-highlight/);

    // 7. Sidebar and New Board Lifecycle
    const newBoardBtn = page.getByRole('button', { name: 'New Board' });
    await newBoardBtn.click();

    // New active board should exist
    const boardItems = page.locator('.board-item');
    await expect(boardItems).toHaveCount(2); // The original (modified) board and the new one
  });
});
