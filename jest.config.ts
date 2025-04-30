import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  preset: '@shelf/jest-mongodb',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^utils/client/(.*)$': '<rootDir>/utils/client/$1',
    '^utils/server/(.*)$': '<rootDir>/utils/server/$1',
    '^utils/test/(.*)$': '<rootDir>/utils/tests:unit/$1',
    '^models/(.*)$': '<rootDir>/models/$1',
    '^components/(.*)$': '<rootDir>/components/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e:tests'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
