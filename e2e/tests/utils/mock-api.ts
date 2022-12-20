import { default as themes } from '../../mock-data/financial-data/themes.json';
import { default as programmes } from '../../mock-data/financial-data/programme.json';
import { Page } from '@playwright/test';

async function mockRefApi(page: Page) {
  await page.route(
    /.*\/nocodb\/CHORUS-DATA\/RefTheme\/.*/,
    async (route: any) => {
      const json = themes;
      await route.fulfill({ json });
    }
  );

  await page.route(
    /.*\/nocodb\/CHORUS-DATA\/RefCodeProgramme\/.*/,
    async (route: any) => {
      const json = programmes;
      await route.fulfill({ json });
    }
  );
}

export default mockRefApi;
