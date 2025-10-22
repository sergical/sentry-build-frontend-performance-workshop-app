import { test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.describe('Generate Home Page Traffic', () => {
  // Create 10 tests that each visit the home page with slow image loading
  for (let i = 0; i < 10; i++) {
    test(`visit ${i + 1} - load home page with slow network`, async ({
      page,
      context,
    }) => {
      test.setTimeout(180000); // 3 minutes per visit

      // Set taller viewport to capture CLS issues (banner shifts, image loading)
      await page.setViewportSize({ width: 1280, height: 1800 });

      // Simulate slower download (for LCP impact) but fast upload (for Sentry telemetry)
      const client = await context.newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: (4 * 1024 * 1024) / 8, // 4 Mbps download (4G-like)
        uploadThroughput: (10 * 1024 * 1024) / 8, // 10 Mbps upload (fast for Sentry)
        latency: 100, // 100ms latency
      });

      console.log(
        `[Visit ${i + 1}/10] Network throttling: 4Mbps down / 10Mbps up (fast Sentry uploads)`
      );

      console.log(`[Visit ${i + 1}/10] Visiting home page`);

      await page.goto('/', { waitUntil: 'load' });

      // Wait for product grid to appear
      await page.waitForSelector('[data-testid="product-grid"]', {
        state: 'visible',
        timeout: 30000,
      });

      // Scroll down to trigger more content loading
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(2000);

      console.log(`[Visit ${i + 1}/10] Home page loaded, navigating to /shop`);

      // Navigate to /shop to trigger a route transition trace in Sentry
      await page.goto('/shop', { waitUntil: 'load' });

      // Wait for shop page to load
      await page.waitForTimeout(2000);

      console.log(`[Visit ${i + 1}/10] Shop page loaded`);

      // Wait for Sentry to finish recording and uploading session replay
      console.log(`[Visit ${i + 1}/10] Waiting for Sentry replay upload...`);
      await page.waitForTimeout(10000);

      console.log(`[Visit ${i + 1}/10] Complete!`);
    });
  }
});
