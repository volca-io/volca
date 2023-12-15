const config = {
  testEnvironment: 'node',
  testRegex: '.*.test.ts',
  testTimeout: 10000,
  setupFilesAfterEnv: ['./.jest/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'esbuild-jest', // or 'jest-ts'
  },
};

export default config;
