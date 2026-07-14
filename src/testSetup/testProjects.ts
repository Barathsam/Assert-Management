const baseConfig = {
    globals: true,
    environment: 'node' as const
}

const modelTests = ['src/**/models/**/*.test.ts']

export const getTestProjects = () => [
    {
        test: {
            ...baseConfig,
            name: { label: 'unit', color: 'orange' as const },
            setupFiles: ['src/__mocks__/globalMocks.ts'],
            maxWorkers: process.env.CI ? 2 : 8,
            include: ['src/**/*.test.ts'],
            exclude: modelTests
        }
    },
    {
        test: {
            ...baseConfig,
            name: { label: 'model', color: 'yellow' as const },
            env: { DB_NAME: 'asset_management_test' },
            globalSetup: ['src/testSetup/globalSetup.ts'],
            setupFiles: ['src/testSetup/modelTestHooks.ts'],
            hookTimeout: 30000,
            testTimeout: 30000,
            pool: 'forks' as const,
            singleFork: true,
            fileParallelism: false,
            maxWorkers: 1,
            minWorkers: 1,
            include: modelTests
        }
    }
]
