// @ts-check
import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

const commonRules = {
    'prettier/prettier': 'warn',
    'no-var': 'error',
    'prefer-const': 'warn',
    quotes: ['warn', 'single', { avoidEscape: true }],
    semi: ['warn', 'always'],
};

export default [
    {
        ignores: ['dist/**'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
            prettier,
        },
        rules: {
            ...commonRules,
            ...js.configs.recommended.rules,
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            prettier,
        },
        rules: commonRules,
    },
    {
        files: ['eslint.config.js', '*.config.js'],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: commonRules,
    },
];
