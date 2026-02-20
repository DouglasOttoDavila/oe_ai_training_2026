import { expect, test } from '@playwright/test';
import { ObjectEdgeHomePage } from '../../src/pages/objectEdgeHome.page';

test.describe('TestRail Case 11073', () => {
  test('[C11073] Verify \"Digital Transformation\" in \"Services\" Dropdown', async ({ page }) => {
    const baseUrl = process.env.TARGET_BASE_URL ?? 'https://www.objectedge.com';
    const homePage = new ObjectEdgeHomePage(page);

    await homePage.goto(baseUrl);

    await homePage.openServicesMenu();
    await expect.poll(async () => homePage.isServicesControlVisible()).toBeTruthy();

    const digitalTransformation = homePage.digitalTransformationItem();
    await expect(digitalTransformation).toBeVisible();
    await expect(digitalTransformation).toBeEnabled();
  });
});
