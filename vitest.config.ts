import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: { __DEV__: true },
  test: {
    include: ['test/automation/**/*.test.ts'],
    testTimeout: 10000,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
})
