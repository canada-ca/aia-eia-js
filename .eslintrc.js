module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  plugins: ["security", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:security/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  overrides: [
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
    },
    {
      files: ["**/*.vue"],
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      extends: ["plugin:vue/recommended", "@vue/typescript", "@vue/prettier"],
    },
  ],
};
