module.exports = {
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/utils/",     // adjust this to your path
    "src/__tests__/mocks/",     // another common case
    "src/__tests__/setup/testUtils.js", // adjust this to your path
  ],
};
