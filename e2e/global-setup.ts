import { chromium } from '@playwright/test';
import login from './tests/utils/login';

const username = process.env.TEST_USERNAME ?? '';
const password = process.env.TEST_PASSWORD ?? '';

async function globalSetup(config: FullConfig): Promise<void> {
  // récupération de la confid du projet nécessitant une authentification
  let index = config.projects.findIndex(
    (p: { _id: string }) => p._id === 'with-login'
  );
  const { storageState } = config.projects[index].use;

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await context.tracing.start({ screenshots: true, snapshots: true });
    await login(page, config.projects[0].use.baseURL, username, password);
    await context.storageState({
      path: storageState,
    });
    await page.close();
  } catch (error) {
    await context.tracing.stop({
      path: './test-results/failed-setup-trace.zip',
    });
    await page.close();
    throw error;
  }

  await browser.close();
}

export default globalSetup;
