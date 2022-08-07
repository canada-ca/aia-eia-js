module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["security"],
  extends: [
    "plugin:security/recommended",
    "plugin:vue/essential",
    "@vue/prettier",
    "@vue/typescript",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
};
