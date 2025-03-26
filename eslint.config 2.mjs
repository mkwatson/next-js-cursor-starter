import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import reactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import importPlugin from "eslint-plugin-import";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends(
    "next/core-web-vitals"
  ),
  {
    plugins: {
      "react-hooks": reactHooks,
      security,
      import: importPlugin,
      sonarjs,
      "@typescript-eslint": tseslint
    },
    rules: {
      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Security
      "security/detect-object-injection": "error",
      "security/detect-eval-with-expression": "error",

      // Imports
      "import/no-unresolved": "error",
      "import/order": [
        "warn",
        { groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]], "newlines-between": "always" }
      ],

      // SonarJS
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/cognitive-complexity": ["warn", 15],

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
    },
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    ignores: [".next/**/*", "node_modules/**/*"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...compat.extends(
      "plugin:@typescript-eslint/recommended"
    ),
    rules: {
      // TypeScript ESLint (explicitly recommended)
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
    }
  }
];