import { test, expect, Page } from '@playwright/test';
import mockRefApi from '../utils/mock-api';

test.describe("Page d'accueil", () => {
  test.beforeEach(async ({ page }) => {
    const navigationPromise = page.waitForNavigation({
      waitUntil: 'networkidle',
    });
    await page.goto('./');
    await mockRefApi(page);
    await navigationPromise;
  });

  test("L'utilisateur est connecté", async ({ page }) => {
    await expect(page).toHaveTitle(
      /^Données financières de l'état en Bretagne*/
    );

    // vérification du formulaire
    await page.getByLabel('Theme').isVisible();
    page
      .getByLabel('Theme')
      .click()
      .then(async () => {
        await expect(
          page
            .getByRole('listbox', { name: 'Theme' })
            .locator('.mdc-list-item__primary-text')
        ).toHaveCount(19);
      });
    await page.getByLabel('Programme').isVisible();

    page
      .getByLabel('Programme')
      .click()
      .then(async () => {
        await expect(
          page
            .getByRole('listbox', { name: 'Programme' })
            .locator('.mdc-list-item__primary-text')
        ).toHaveCount(133);
      });
    await page.getByLabel('Département').isVisible();
    await page.getByLabel('Année').isVisible();
    expect((await page.locator('form').getByRole('button').count()) == 1);
  });
});
