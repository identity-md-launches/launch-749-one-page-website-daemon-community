import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './scripts',
  testMatch: 'site.spec.ts',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4173/preview/', browserName: 'chromium', headless: true },
  webServer: { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:4173/preview/', reuseExistingServer: false },
  reporter: 'list',
});
