import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'src/domain/utils/**/*.ts',
        'src/domain/entities/**/*.ts',
      ],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        'knexfile.ts',
        'src/index.ts',
        '**/*.config.ts',
        '**/*.config.js',
        '**/dto/**',
        '**/enums/**',
        '**/repositories/**',
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 84,
        statements: 90,
      },
      all: false,
      skipFull: true,
    },
  },
});
