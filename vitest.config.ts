import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
        setupFiles: ['./src/test/setup.ts'],
        coverage: {
            provider: 'v8',
            include: [
                'src/domain/**/*.ts',
                'src/modules/**/*.ts',
                'src/utils/bootstrap-settings.ts',
                'src/server/catalog.ts',
                'src/hooks/use-dialog-step.ts',
            ],
            exclude: ['**/*.test.*'],
            thresholds: { lines: 85, functions: 85, statements: 85, branches: 80 },
        },
    },
});
