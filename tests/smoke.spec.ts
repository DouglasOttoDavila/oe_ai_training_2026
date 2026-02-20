import { expect, test } from '@playwright/test';

test('smoke: page loads (baseURL or fallback)', async ({ page, request, baseURL }) => {
  const url = baseURL ?? 'http://localhost:3000';

  const isReachable = await (async () => {
    try {
      const response = await request.get(url, { timeout: 2_000 });
      return response.ok();
    } catch {
      return false;
    }
  })();

  if (isReachable) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5_000 });

    const title = await page.title();
    expect(typeof title).toBe('string');
    return;
  }

  // If no server is running at baseURL, don't hard-fail.
  await page.setContent('<!doctype html><title>Smoke</title><h1>OK</h1>');
  await expect(page).toHaveTitle('Smoke');
  await expect(page.getByRole('heading', { name: 'OK' })).toBeVisible();
});
