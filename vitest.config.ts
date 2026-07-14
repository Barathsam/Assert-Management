import { defineConfig } from 'vitest/config'
import { coverageThresholds } from './src/testSetup/coverageThresholds'
import { getTestProjects } from './src/testSetup/testProjects'

export default defineConfig({
    test: {
        globals: true,
        reporters: ['default'],
        fileParallelism: false,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary'],
            thresholds: coverageThresholds,
            include: ['src/**/*.ts'],
            exclude: [
                'src/**/*.test.ts',
                'src/**/seed/**',
                'src/**/testFactory/**',
                'src/testSetup/**',
                'src/__mocks__/**',
                'src/**/routes/**',
                'src/**/validation/**',
                'src/**/types/**',
                'src/server.ts'
            ]
        },
        projects: getTestProjects()
    }
})
