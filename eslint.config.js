import * as tseslint from "typescript-eslint";
import * as eslint from "typescript-eslint";

export default tseslint.config({
  ignores: ['**/dist/**'],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.strict,
  ],
});