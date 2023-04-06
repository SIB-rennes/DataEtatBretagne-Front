import { test, expect } from '@playwright/test';
import mockRefApi from '../utils/mock-api';

test.describe("Page d'accueil", () => {
  test.beforeEach(async ({ page }) => {
    const navigationPromise = page.waitForNavigation({
      waitUntil: 'networkidle',
    });
    await mockRefApi(page);
    await page.goto('./');
    await navigationPromise;
  });

  test("L'utilisateur est connecté", async ({ page }) => {
    await expect(page).toHaveTitle(
      /^Données financières de l'état en Bretagne*/
    );

    await page
      .getByRole('button', { name: "Information de l'utilisateur" })
      .isVisible();

    // vérification du formulaire
    await page.getByLabel('Thème').click();
    await expect(
      page
        .getByRole('listbox', { name: 'Thème' })
        .locator('.mdc-list-item__primary-text')
    ).toHaveCount(18);

    await page.getByLabel('Programme').click({ force: true });
    await page.getByLabel('Programme').click({ force: true });
    await expect(
      page
        .getByRole('listbox', { name: 'Programme' })
        .locator('.mdc-list-item__primary-text')
    ).toHaveCount(132);

    // vérification des niveaux de localisation
    await expect(page.locator('data-test-id=category-localisation')).toHaveText(
      ''
    );
    await page.getByTestId('niveau-localisation').click({ force: true });
    await page.getByTestId('niveau-localisation').click({ force: true });
    await expect(
      page
        .getByRole('listbox', { name: 'Zone géographique' })
        .locator('.mdc-list-item__primary-text')
    ).toHaveCount(5);

    await page.getByLabel('Année').isVisible();
    await page.getByLabel('Bénéficiaire').isVisible();
    expect((await page.locator('form').getByRole('button').count()) == 1);
  });
});

test.describe('Page de Management', () => {
  test("L'utilisateur n'a pas accès à la page de management", async ({
    page,
  }) => {
    const navigationPromise = page.waitForNavigation({
      waitUntil: 'networkidle',
      url: /^(http|https):\/\/.*(?<!(management))$/,
    });
    await page.goto('./management');
    await navigationPromise;
    expect(page.url()).not.toContain('/management');
    await expect(page.locator('id=administration')).toHaveCount(0);
  });
});
