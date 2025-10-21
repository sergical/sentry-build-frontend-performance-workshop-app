import { test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.describe('Generate Home Page Traffic', () => {
  // Create 10 tests that each visit the home page with throttled connection
  for (let i = 0; i < 10; i++) {
    test(`visit ${i + 1} - load home page with throttling`, async ({
      page,
      context,
    }) => {
      test.setTimeout(60000); // 1 minute per visit

      // Set taller viewport to capture CLS issues (banner shifts, image loading)
      await page.setViewportSize({ width: 1280, height: 1800 });

      // Set up route handler for network emulation
      await context.route('**/*', async (route) => {
        await route.continue();
      });

      // Set network throttling for ~5-10 second load time
      // With ~22.5MB of images (15 products × 1.5MB), we need ~3-4 MB/s download speed
      const client = await context.newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: 3.5 * 1024 * 1024, // 3.5 MB/s (28 Mbps)
        uploadThroughput: 1 * 1024 * 1024, // 1 MB/s (8 Mbps)
        latency: 50, // 50ms latency for realism
      });

      console.log(`[Visit ${i + 1}/10] Visiting home page`);

      await page.goto('/');

      // Wait for page to fully load including all network requests
      await page.waitForLoadState('networkidle');

      // Wait for product grid to be visible (ensures products are loaded)
      await page.waitForSelector('[data-testid="product-grid"]', {
        state: 'visible',
        timeout: 30000,
      });

      // Scroll down to ensure more content is visible for CLS measurement
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(1000); // Wait for any delayed layout shifts

      console.log(`[Visit ${i + 1}/10] Page fully loaded`);
    });
  }
});
