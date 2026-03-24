import { defineConfig, devices, Project } from '@playwright/test';

import dotenv from 'dotenv';
import { BASE_URL, AUTH_FILE } from './globals';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

type Device = {
  name: string;
  device: Project['use'];
};

const desktopDevices = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
];

const mobileDevices = [
  { name: 'Mobile Chrome', device: devices['Pixel 5'] },
  { name: 'Mobile Safari', device: devices['iPhone 12'] },
];

const getProjects = (desktop: Device[], mobile: Device[]) => {
  return [...desktop, ...mobile].reduce<Project[]>((acc, curr) => {
    const { name, device } = curr;

    // loggedIn folder setup
    acc.push({
      name: `${name}-loggedIn`,
      use: { ...device, storageState: AUTH_FILE },
      dependencies: ['auth-setup'],
      testMatch: /loggedIn\/.*\.spec\.ts/,
    });

    // auth folder setup
    acc.push({
      name: `${name}-auth`,
      use: device,
      dependencies: ['global-setup'],
      testMatch: /auth\/.*\.spec\.ts/,
    });

    // No session
    if (name === 'chromium') {
      acc.push({
        name: `${name}-public`,
        use: { ...device, storageState: { cookies: [], origins: [] } },
        testMatch: /public\/.*\.spec\.ts/,
      });
    }

    return acc;
  }, []);
};

export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'blob' : [['html', { open: 'never' }]],

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'global-setup',
      testMatch: /global-setup\.ts/,
    },

    {
      name: 'auth-setup',
      testMatch: /auth\.setup\.ts/,
    },
    ...getProjects(desktopDevices, mobileDevices),
  ],
  use: {
    baseURL: process.env.BASE_URL || BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    // Next 14 specific: Ensure metadata/headers don't clash
    extraHTTPHeaders: {
      'x-playwright-test': 'true',
    },
  },
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        env: {
          NODE_ENV: 'test',
          NEXTAUTH_URL: BASE_URL,
          NEXTAUTH_SECRET: 'test-secret',
          MONGOTESTDB_URI:
            process.env.MONGOTESTDB_URI ||
            'mongodb://localhost:27017/materialdb_test',
        },
      },
});
