import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Primary goal: catch stray console.log in production code
      "no-console": "warn",

      // TypeScript handles these — disable to avoid false positives
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-prototype-builtins": "off",
      "@typescript-eslint/no-require-imports": "off",

      // Pre-existing violations — warn for now, upgrade to error as code is fixed
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-cond-assign": "warn",
      "no-fallthrough": "warn",
      "no-empty": "warn",
      "no-constant-condition": "warn",
      "no-useless-assignment": "warn",
      "preserve-caught-error": "off",
    },
  },
  {
    ignores: [".next/", "node_modules/", "dist/", "*.config.js", "*.config.mjs"],
  },
);
