/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  detectOpenHandles: true,
  moduleNameMapper: {
    '^packages/(.*)$': '<rootDir>/packages/$1',
    '^publish/(.*)$': '<rootDir>/publish/$1'
  }
}
