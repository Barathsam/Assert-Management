import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import vitest from '@vitest/eslint-plugin'

export default tseslint.config(
    { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },
    preferArrowFunctions.configs.all,
    eslint.configs.recommended,
    {
        files: ['**/*.ts'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            vitest
        },
        languageOptions: {
            parser: tseslint.parser,
            globals: {
                ...vitest.environments.env.globals,
                ...globals.node
            }
        },
        linterOptions: { noInlineConfig: true },
        rules: {
            semi: [2, 'never'],
            indent: 'off',
            'comma-dangle': ['error', 'never'],
            'operator-linebreak': 0,
            'implicit-arrow-linebreak': 0,
            'function-paren-newline': 0,
            'max-lines': ['warn', 50],
            'max-depth': ['error', 3],
            'max-statements': ['warn', 6],
            'object-curly-newline': 0,
            radix: 'off',
            'consistent-return': 'off',
            'no-unused-vars': 'off',
            'no-redeclare': 'warn',
            complexity: ['warn', { max: 3 }]
        }
    },
    {
        files: ['**/*.test.ts'],
        rules: {
            complexity: ['warn', 3],
            'max-lines': ['warn', 200],
            'max-statements': ['warn', 42],
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    {
        files: ['**/models/testFactory/**/*.ts', '**/testSetup/**/*.ts', '**/__mocks__/**/*.ts'],
        rules: {
            complexity: 'off',
            'max-lines': ['warn', 60],
            'max-statements': ['warn', 20],
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    {
        files: ['**/seed/**/*.ts', '**/db/entities/**/*.ts'],
        rules: {
            'max-lines': ['warn', 60],
            'max-statements': 'off',
            complexity: 'off'
        }
    },
    {
        files: ['src/public/js/**/*.js'],
        languageOptions: {
            globals: { $: 'readonly', document: 'readonly', window: 'readonly' }
        },
        rules: {
            'prefer-arrow-functions/prefer-arrow-functions': 'off'
        }
    },
    {
        files: ['migrations/**/*.js', 'seeders/**/*.js', 'config/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: { ...globals.node }
        },
        rules: {
            'max-lines': 'off',
            'max-statements': 'off',
            complexity: 'off',
            semi: 'off',
            'comma-dangle': 'off',
            'prefer-arrow-functions/prefer-arrow-functions': 'off'
        }
    }
)
