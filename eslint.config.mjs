import js from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['coverage/**', '**/dist/**']),
  {
    files: [tseslint.globs.jsts],
    extends: [js.configs.recommended],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
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
  // Formatting is Prettier's job. Keep last so it wins over the configs above.
  prettier,
);
