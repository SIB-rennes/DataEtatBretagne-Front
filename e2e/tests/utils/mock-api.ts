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


  await page.route(
    /.*\/badministration\/api\/v1\/audit\/FINANCIAL_DATA_AE\/.*/,
    async (route: any) => {
      const json = {
        "date": "2023-06-02T10:21:06.167896+00:00"
    };
      await route.fulfill({ json });
    }
  );



}

export default mockRefApi;
