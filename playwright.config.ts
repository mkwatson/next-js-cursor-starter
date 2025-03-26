import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests/e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});