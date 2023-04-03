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

  test("L'utilisateur a accès à la page de liste des utilisateurs", async ({
    page,
  }) => {
    await expect(page.locator('id=administration')).toBeVisible();
    await page.locator('id=administration').click();

    await expect(
      page.getByRole('menuitem', { name: 'Gestion des utilisateurs' })
    ).toBeVisible();

    await expect(
      page.getByRole('menuitem', { name: 'Charger des données' })
    ).toBeVisible();

    await page
      .getByRole('menuitem', { name: 'Gestion des utilisateurs' })
      .click();

    await expect(page.locator('mat-card-title')).toHaveText(
      'Liste des utilisateurs'
    );

    expect(page.url()).toContain('/administration/management');
  });

  test("L'utilisateur a  accès à la page de management via le lien", async ({
    page,
  }) => {
    await page.goto('./administration/management');
    expect(page.url()).toContain('/administration/management');
  });
});
