import { FullConfig, chromium } from '@playwright/test';
import login from './tests/utils/login';

async function globalSetup(config: FullConfig): Promise<void> {
  // récupération de la confid du projet nécessitant une authentification
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await _login_profile(
    browser,
    'simple',
    config.projects[0].use.baseURL,
    process.env.TEST_USERNAME ?? '',
    process.env.TEST_PASSWORD ?? ''
  );

  await _login_profile(
    browser,
    'admin',
    config.projects[0].use.baseURL,
    process.env.TEST_USERNAME_ADMIN ?? '',
    process.env.TEST_PASSWORD_ADMIN ?? ''
  );

  await browser.close();
}

async function _login_profile(
  browser: any,
  profile: string,
  baseUrl: string,
  username: string,
  password: string
) {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await context.tracing.start({ screenshots: true, snapshots: true });
    await login(page, baseUrl, username, password);

    await context.storageState({
      path: `storage-state/storageState-${profile}.json`,
    });
    await page.close();
  } catch (error) {
    await context.tracing.stop({
      path: './test-results/failed-setup-trace.zip',
    });
    await page.close();
    throw error;
  }
}

export default globalSetup;
