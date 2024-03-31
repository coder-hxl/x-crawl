/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  detectOpenHandles: true,
  moduleNameMapper: {
    '^packages/(.*)$': '<rootDir>/packages/$1',
    '^publish/(.*)$': '<rootDir>/publish/$1'
  }
}
