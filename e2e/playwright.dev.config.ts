import config from './playwright.config';

const devConfig = {
  ...config,

  // webServer: {
  //   command: 'npm run start:financial-dev',
  //   timeout: 120 * 1000,
  //   reuseExistingServer: !process.env.CI,
  // },
  use: {
    baseURL: 'http://localhost:4200/',
  },
};

export default devConfig;
