import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import {defineConfig, globalIgnores} from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const stylisticConfig = stylistic.configs.customize({
  arrowParens: true,
  blockSpacing: true,
  braceStyle: '1tbs',
  commaDangle: 'always-multiline',
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: true,
});

export default defineConfig(
  globalIgnores(['coverage/**', '**/dist/**']),
  {
    files: [tseslint.globs.jsts],
    extends: [js.configs.recommended, stylisticConfig],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@stylistic/object-curly-spacing': ['error', 'never'],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportExpression',
          message:
            'Keep imports at the top of the module. Avoid inline dynamic import().',
        },
      ],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
    },
  },
  {
    files: [tseslint.globs.ts],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
