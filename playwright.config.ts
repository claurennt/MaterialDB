import { defineConfig, devices, Project } from '@playwright/test';

import dotenv from 'dotenv';
import { BASE_URL, HOSTNAME, PORT } from './globals';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const TEST_DB_URL =
  process.env.MONGOTESTDB_URI ||
  'mongodb://localhost:27017/materialDB-project-test';

// 1. Centralize your constants
const AUTH_FILE = 'utils/tests-e2e/user.json';
const AUTH_DEPENDENCY = ['setup'];

type Device = {
  name: string;
  device: Project['use'];
};

// 2. Define your devices in a clean list
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

    // Session
    acc.push({
      name: `${name}-auth`,
      use: { ...device, storageState: AUTH_FILE },
      dependencies: AUTH_DEPENDENCY,
      testIgnore: [
        /tests-e2e\/auth\/.*/,
        /tests-e2e\/public\/.*/,
        /.*\.setup\.ts/,
        /global-setup\.ts/,
      ],
    });

    // No session
    if (name === 'chromium') {
      acc.push({
        name: `${name}-guest`,
        use: { ...device, storageState: { cookies: [], origins: [] } },
        testMatch: [/tests-e2e\/auth\/.*/, /tests-e2e\/public\/.*/],
      });
    }

    return acc;
  }, []);
};

export default defineConfig({
  globalSetup: require.resolve('./tests-e2e/global-setup.ts'),
  testDir: './tests-e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'blob' : 'html',

  /* Configure projects for major browsers */
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    ...getProjects(desktopDevices, mobileDevices),
  ],
  /* Shared settings for all the projects */
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    // Next 14 specific: Ensure metadata/headers don't clash
    extraHTTPHeaders: {
      'x-playwright-test': 'true',
    },
  },

  /* WebServer configuration */
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,

    env: {
      PORT,
      HOSTNAME,
      NODE_ENV: 'test',
      NEXTAUTH_URL: BASE_URL,
      NEXTAUTH_SECRET: 'test-secret',
      MONGODB_URI: TEST_DB_URL,
      MONGOTESTDB_URI: TEST_DB_URL,
    },
  },
});
