const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
        parserOptions: {},

        globals: {
            ...globals.browser,
        },
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
    },

    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ),

    rules: {
        "prettier/prettier": "error",
        "eqeqeq": ["error", "always"],
        "no-console": "warn",
        "no-debugger": "error",
        "curly": ["error", "all"],
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["warn", {
            "argsIgnorePattern": "^_",
        }],

        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "no-var": "error",
        "prefer-const": "error",

        "no-multiple-empty-lines": ["error", {
            "max": 1,
            "maxEOF": 0,
        }],

        "semi": "off",
        "quotes": "off",
    },
}, globalIgnores([
    "**/node_modules",
    "**/library",
    "**/local",
    "**/temp",
    "**/build",
    "**/settings",
    "**/profiles",
    "**/configs",
])]);
