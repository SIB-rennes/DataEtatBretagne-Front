import { test, expect, Page } from '@playwright/test';
import mockRefApi from '../../utils/mock-api';

test.describe("Page d'accueil", () => {
  test.beforeEach(async ({ page }) => {
    const navigationPromise = page.waitForNavigation({
      waitUntil: 'networkidle',
    });
    await page.goto('./');
    await mockRefApi(page);
    await navigationPromise;
  });

  test("L'utilisateur a accès à la page de management", async ({ page }) => {
    await expect(page.locator('id=administration')).toBeVisible();
    await page.locator('id=administration').click();

    await expect(page.locator('mat-card-title')).toHaveText(
      'Liste des utilisateurs'
    );
    expect(page.url()).toContain('/management');
  });

  test("L'utilisateur a  accès à la page de management via le lien", async ({
    page,
  }) => {
    await page.goto('./management');
    expect(page.url()).toContain('/management');

    // expect(page.url()).toMatch(/^(https|http):\/\/.*\/management$/);
  });
});
