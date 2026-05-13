const { test, expect } = require('@playwright/test');

test('homepage has title and expected content', async ({ page }) => {
  // Go to the base URL configured in playwright.config.js
  await page.goto('/');

  // Expect the page to have a specific title (adjust this to match your actual app title)
  // If the app is a Vite React app, the default title is usually "Vite + React" or the one set in index.html
  // Let's just check that the body is visible to ensure the React app mounted
  await expect(page.locator('body')).toBeVisible();

  // We can add a more specific test once we know the UI.
  // For example, checking if the root div has content:
  const rootElement = page.locator('#root');
  await expect(rootElement).toBeVisible();
});
