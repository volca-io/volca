import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.*.test.ts',
  testTimeout: 10000,
  setupFilesAfterEnv: ['./.jest/jest.setup.ts'],
  moduleNameMapper: {
    '#node-web-compat': './node-web-compat-node.js',
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: false,
      },
    ],
  },
};

export default config;
