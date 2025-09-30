// eslint.config.mts (Flat config for TS + React)
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

const TYPE_AWARE = false;

export default [
  {
    ignores: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**'],
  },

  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,

  {
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': a11y as any },
    rules: {
      ...(reactHooks.configs.recommended.rules as object),
      ...((a11y as any).configs.recommended.rules as object),
    },
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  prettier,
];
