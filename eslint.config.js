import * as eslint from 'typescript-eslint';
import * as tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config({
  ignores: ['**/dist/**', 'commitlint.config.ts', 'eslint.config.js'],
  extends: [
    eslint.configs.recommended,
    'plugin:@typescript-eslint/recommended',
    eslintPluginPrettier,
    tseslint.configs.recommended,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      rules: {
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off'
      }
    },
  ],
});