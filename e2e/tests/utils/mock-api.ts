import { default as programmes } from '../../mock-data/financial-data/programme.json';
import { Page } from '@playwright/test';

async function mockRefApi(page: Page) {
  await page.route(
    /.*\/budget\/api\/v1\/programme.*/,
    async (route: any) => {
      const json = programmes;
      await route.fulfill({ json });
    }
  );

}

export default mockRefApi;
