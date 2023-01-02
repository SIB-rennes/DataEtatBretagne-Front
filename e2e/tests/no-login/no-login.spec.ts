import { test, expect } from '@playwright/test';

test.describe("Page d'authentification", () => {
  test.beforeEach(async ({ page }) => {
    await waitingRedirectKeycloak(page);
  });

  test("L'utilisateur non connecté est redirigé vers la page de login", async ({
    page,
  }) => {
    await expect(page).toHaveURL(/^https:\/\/auth.*/);

    await expect(page).toHaveTitle(/^Se connecter .*/);

    await expect(await page.textContent('h1')).toBe('Connexion');

    await expect(await page.locator('button').textContent()).toBe(
      'Se connecter'
    );
  });

  test("L'utilisateur ne peux pas se connecter", async ({ page }) => {
    await page.locator('.fr-alert--error').isHidden();

    await page.locator('button', { hasText: 'Se connecter' }).click();

    const alert = page.locator('.fr-alert--error');
    await alert.isVisible();
    await expect(await alert.locator('p').textContent()).toContain(
      "Nom d'utilisateur ou mot de passe invalide"
    );
  });
});

// attente de redirection vers keycloak
async function waitingRedirectKeycloak(page) {
  const navigationPromise = page.waitForNavigation({
    url: /^https:\/\/auth.*/,
    waitUntil: 'networkidle',
  });

  await page.goto('./');

  await navigationPromise;
}
