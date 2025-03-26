import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import reactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import importPlugin from "eslint-plugin-import";
import sonarjs from "eslint-plugin-sonarjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "react-hooks": reactHooks,
      security,
      import: importPlugin,
      sonarjs,
    },
    rules: {
      // React hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Security rules
      "security/detect-object-injection": "error",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-eval-with-expression": "error",

      // Import rules
      "import/no-unresolved": "error",
      "import/no-duplicates": "warn",
      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          "newlines-between": "always"
        }
      ],

      // General best practices
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/cognitive-complexity": ["warn", 15],
    },
  },
];