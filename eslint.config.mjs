import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist", ".next", "node_modules", "out", "build"] },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        location: "readonly",
        fetch: "readonly",
        // Node.js globals
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        // Shared globals
        console: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
      },
    },
  },

  // ESLint recommended rules (includes new v10 rules: no-unassigned-vars, no-useless-assignment, preserve-caught-error)
  js.configs.recommended,

  // TypeScript ESLint rules
  ...tseslint.configs.recommended,

  // React Hooks plugin
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Prettier integration (disables ESLint formatting rules)
  prettier,

  // Custom rule configurations
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Disable JS version, use TS version
      "no-unused-vars": "off",
      "no-undef": "off",

      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // ESLint v10 breaking changes handling
      // The new rules from eslint:recommended are now enabled by default:
      // - no-unassigned-vars (new in v10)
      // - no-useless-assignment (new in v10)
      // - preserve-caught-error (new in v10)
    },
  },

  // Specific configuration for Next.js app directory
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off", // Next.js handles these
    },
  },
];
