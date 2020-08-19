module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "airbnb-base",
        "airbnb/hooks",
        "prettier",
        "prettier/@typescript-eslint",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "plugin:jest/recommended",
    ],
    plugins: ["react", "import", "jest", "jsx-a11y", "prettier"],
    env: {
        browser: true,
        es6: true,
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        "import/no-extraneous-dependencies": [
            "warn",
            {
                devDependencies: ["**/*.test.js", "**/*.test.jsx", "**/setup-tests.js"],
            },
        ],
        "linebreak-style": "off",
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "import/prefer-default-export": "off",
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
        ],
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
    },
};
