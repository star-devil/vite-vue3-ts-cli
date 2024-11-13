/** @format */

import pluginJs from '@eslint/js';
import markdown from "eslint-plugin-markdown";
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vue_parser from 'vue-eslint-parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '*.md',
      '.local',
      '.git',
      '.vscode',
      '.husky',
      'Dockerfile',
      'package-lock.json',
      'pnpm-lock.yaml'
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...markdown.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue_parser,
      parserOptions: {
        sourceType: 'module',
        parser: tseslint.parser
      }
    }
  },
  {
    rules: {
      'no-var': 'error', // 不允许使用var定义
      'prefer-const': 'error', // 强制在可能的情况下使用 const 声明变量，而不是 let
      'no-empty': ['error', { allowEmptyCatch: true }], // 允许catch空着
    }
  }
];
