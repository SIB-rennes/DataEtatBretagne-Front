import { Page } from '@playwright/test';

async function login(
  page: Page,
  url: string,
  username: string,
  password: string
): Promise<void> {
  await page.goto(url);
  await page.getByLabel('Identifiant').fill(username);
  await page.getByLabel('Mot de passe',{ exact: true }).fill(password);

  await Promise.all([
    page.waitForURL(url),
    page.locator('button', { hasText: 'Se connecter' }).click(),
  ]);
}

export default login;
