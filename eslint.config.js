import * as eslint from "typescript-eslint";
import * as tseslint from "typescript-eslint";

export default tseslint.config({
  ignores: ['**/dist/**', 'commitlint.config.ts', 'eslint.config.js'],
  extends: [
    eslint.configs.stylistic,
    tseslint.configs.stylistic,
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