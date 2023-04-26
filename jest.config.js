/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  detectOpenHandles: true,
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^publish/(.*)$': '<rootDir>/publish/$1'
  }
}
