import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    testTimeout: 30000,
    // Run database tests sequentially to avoid conflicts
    fileParallelism: false,
  },
  resolve: {
    alias: {
      '@/core': path.resolve(__dirname, '../src/core'),
      '@/features': path.resolve(__dirname, '../src/features'),
      '@/infrastructure': path.resolve(__dirname, '../src/infrastructure'),
      '@/shared': path.resolve(__dirname, '../src/shared'),
      '@/app': path.resolve(__dirname, '../app'),
      '@/tests': path.resolve(__dirname, '../tests'),
      '@': path.resolve(__dirname, '../'),
    },
  },
});








