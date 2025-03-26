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
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked"
  ),
  {
    plugins: {
      "react-hooks": reactHooks,
      security,
      import: importPlugin,
      sonarjs,
      "@typescript-eslint": tseslint,
      jsdoc: (await import('eslint-plugin-jsdoc')).default,
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

      // TypeScript ESLint (explicitly recommended)
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": ["warn", { "allowExpressions": true }],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",

      // JSDoc
      "jsdoc/require-jsdoc": ["warn", {
        "require": {
          "FunctionDeclaration": true,
          "MethodDefinition": true,
          "ClassDeclaration": true,
          "ArrowFunctionExpression": false,
        }
      }],

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
    },
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
  },
];