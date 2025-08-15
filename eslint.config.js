import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import * as parserVue from 'vue-eslint-parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import markdown from 'eslint-plugin-markdown';
import globals from 'globals';
import autoImport from './.eslintrc-auto-import.json' with { type: 'json' };
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    '**/.*',
    '**/dist/**',
    '*.d.ts',
    'public/*',
    'src/assets/**',
    'src/**/iconfont/**'
  ]),
  // 1. 配置全局变量,js配置
  {
    ...pluginJs.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.worker,
        ...globals.es2021,
        ...autoImport.globals
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      // 关闭 与prettier冲突的规则
      ...eslintConfigPrettier.rules,
      ...prettierPlugin.configs.recommended.rules,
      'no-debugger': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  },
  // 2. typescript 配置
  ...tseslint.config({
    extends: [...tseslint.configs.recommended],
    files: ['**/*.?([cm])ts', '**/*.?([cm])tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser
    },
    /** @link https://typescript-eslint.io/rules/ */
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off', // 禁止使用 @ts-ignore 注释
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 允许不显式声明函数返回类型
      '@typescript-eslint/no-async-promise-executor': 'off', // 允许使用async-promise-executor
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用any类型
      '@typescript-eslint/no-empty-function': 'off', // 允许使用空函数
      '@typescript-eslint/no-unused-expressions': 'off', // 允许未使用的表达式
      '@typescript-eslint/no-namespace': 'off', // 允许使用自定义 TypeScript 模块和命名空间。
      '@typescript-eslint/no-non-null-assertion': 'off', // 禁止使用非空断言
      '@typescript-eslint/no-redeclare': 'error', // 禁止重复声明变量
      '@typescript-eslint/no-unsafe-function-type': 'off', // 禁止使用不安全的函数类型
      '@typescript-eslint/no-import-type-side-effects': 'error', // 禁止导入类型时产生副作用
      '@typescript-eslint/prefer-as-const': 'warn', // 建议使用 as const 类型断言
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' }
      ], // 强制使用内联类型导入
      '@typescript-eslint/prefer-literal-enum-member': [
        'error',
        { allowBitwiseExpressions: true }
      ], // 强制使用字面量枚举成员
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ] // 禁止定义未使用的变量
    }
  }),

  // 3.  vue 配置
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        $: 'readonly',
        $$: 'readonly',
        $computed: 'readonly',
        $customRef: 'readonly',
        $ref: 'readonly',
        $shallowRef: 'readonly',
        $toRef: 'readonly'
      },
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser, // 用于解析 <script> 中的 TypeScript
        ecmaFeatures: {
          jsx: true,
          tsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      vue: pluginVue
    },
    processor: pluginVue.processors['.vue'],
    /** @link https://eslint.vuejs.org/rules/ */
    rules: {
      'no-undef': 'off', // 关闭未定义变量规则
      'no-unused-vars': 'off', // 关闭未使用变量规则
      'vue/no-v-html': 'off', // 关闭对 `v-html` 使用的规则
      'vue/component-name-in-template-casing': ['error', 'PascalCase'], // 模板中组件名大小写
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ], // HTML标签自闭合
      /**
       * component 组件相关规则
       */
      'vue/no-unused-components': 'error', // 未使用组件检查
      'vue/component-definition-name-casing': ['error', 'PascalCase'], // 组件名大小写
      'vue/multi-word-component-names': 'off', // 关闭组件名称必须是多单词的规则
      // defineMacros 顺序
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits']
        }
      ],
      /**
       * props 模板相关规则
       */
      'vue/no-setup-props-reactivity-loss': 'off', // 关闭对 `setup` 中 `props` 响应性丢失的规则
      'vue/require-default-prop': 'off', // 关闭要求组件 `prop` 必须有默认值的规则
      /**
       * 其它规则
       */
      'vue/require-explicit-emits': 'off', // 关闭对 `emits` 必须显式声明的规则

      // 关闭 与prettier冲突的 规则
      ...eslintConfigPrettier.rules
    }
  },

  // 4. markdown配置
  ...markdown.configs.recommended,

  // 5. 其他文件配置
  {
    files: ['**/*.d.ts'],
    rules: {
      'eslint-comments/no-unlimited-disable': 'off', // 关闭无限禁用规则
      'import/no-duplicates': 'off', // 关闭导入重复规则
      'no-restricted-syntax': 'off', // 关闭禁止使用特定语法规则
      'unused-imports/no-unused-vars': 'off' // 关闭未使用变量规则
    }
  },
  {
    files: ['**/*.?([cm])js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off' // 关闭禁止使用require导入规则
    }
  },

  // 6. 通用规则
  {
    rules: {
      'no-var': 'error', // 不允许使用var定义
      'prefer-const': 'error', // 强制在可能的情况下使用 const 声明变量，而不是 let
      'no-empty': ['error', { allowEmptyCatch: true }], // 允许catch空着
      'no-alert': 'error', // 不允许使用alert
      'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
      'no-unexpected-multiline': 'error', // 禁止空余的多行
      eqeqeq: ['error', 'smart'], // 比较的时候使用严格等于
      'switch-colon-spacing': ['error', { before: false, after: true }], // switch 冒号后要有空格
      'brace-style': ['error', '1tbs', { allowSingleLine: true }], // 大括号风格 ["error", "1tbs"]
      'no-dupe-keys': 'error', // 对象中不允许出现重复的键
      'no-sparse-arrays': 'error', // 禁止稀疏数组， [1,,2]
      'block-scoped-var': 'error', // 将变量声明放在合适的代码块里
      'no-self-compare': 'error', // 不允许自身比较
      'no-const-assign': 'error', // 禁止修改const声明的变量
      'no-redeclare': 'error', // 禁止重复声明变量
      'no-func-assign': 'error', // 禁止重复的函数声明
      'no-shadow': 'error' // 外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
    }
  }
]);
