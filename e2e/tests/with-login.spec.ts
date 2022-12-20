import { test, expect } from '@playwright/test';

test.describe("Page d'accueil", () => {
  test("L'utilisateur est connecté", async ({ page }) => {
    await page.goto('./');
    await expect(page).toHaveTitle(
      /^Données financières de l'état en Bretagne*/
    );
  });
});
