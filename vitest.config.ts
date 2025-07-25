// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  // importa dinámicamente el ESM de vite-tsconfig-paths
  const { default: tsconfigPaths } = await import('vite-tsconfig-paths')

  return {
    resolve: {
      alias: {
        // ajusta tu alias según tu estructura
        '@': '/src'
      },
    },
    plugins: [
      tsconfigPaths()
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        reporter: ['text', 'lcov'],
        exclude: ['node_modules/', 'src/app/components/**/styles.ts']
      }
    }
  }
})
