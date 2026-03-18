import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  moduleNameMapper: {
    '^@models$': '<rootDir>/models/index.ts',
    '^@types$': '<rootDir>/types/index.ts',
    '^@components/(.*)$': '<rootDir>/components/$1/index.tsx',
    '^@lib/client$': '<rootDir>/app/lib/client/index.ts',
    '^@lib/client/hooks/(.*)$': '<rootDir>/app/lib/client/hooks/$1',
    '^@lib/server$': '<rootDir>/app/lib/server/index.ts',
    '^@actions/(.*)$': '<rootDir>/app/actions/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e-tests/',
  ],
};

export default createJestConfig(config);
