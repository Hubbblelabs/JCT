import coreWebVitalsConfig from "eslint-config-next/core-web-vitals";
import typescriptConfig from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...coreWebVitalsConfig,
  ...typescriptConfig,
  prettierConfig,

  // Tailwind plugin config
  {
    plugins: {
      
    },
    
  },

  // Existing rules
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;