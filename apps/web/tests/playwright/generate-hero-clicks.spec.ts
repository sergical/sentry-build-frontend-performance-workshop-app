import { test } from '@playwright/test';

test.describe('Generate Hero Button Click Traffic', () => {
  test('click hero button 5 times', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes

    console.log('Loading home page');

    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    console.log('Page loaded, starting clicks');

    // Click the "Shop Solutions" hero button 5 times
    for (let click = 1; click <= 5; click++) {
      console.log(`Click ${click}/5 - Clicking hero button`);

      // Find and click the "Shop Solutions" button
      const heroButton = page.getByRole('button', {
        name: /shop solutions/i,
      });
      await heroButton.click();

      // Small delay between clicks
      await page.waitForTimeout(500);
    }

    console.log('All clicks complete, waiting 10 seconds');

    // Wait 10 seconds before closing
    await page.waitForTimeout(10000);

    console.log('Test complete!');
  });
});
