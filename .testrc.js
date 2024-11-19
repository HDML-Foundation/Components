/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

const { legacyPlugin } = require("@web/dev-server-legacy");
const { playwrightLauncher } = require("@web/test-runner-playwright");
const browsers = {
  chromium: playwrightLauncher({product: "chromium"}),
  firefox: playwrightLauncher({product: "firefox"}),
  webkit: playwrightLauncher({product: "webkit"}),
};

module.exports = {
  rootDir: ".",
  files: ["./tst/**/*.test.js"],
  nodeResolve: {
    exportConditions: process.env.MODE === "dev"
      ? ["development"]
      : ["prod"]},
  preserveSymlinks: true,
  browsers: Object.values(browsers),
  testFramework: {
    config: {
      ui: "tdd",
      timeout: "60000",
    },
  },
  plugins: [
    legacyPlugin({
      polyfills: {
        webcomponents: true,
        custom: [{
          name: "lit-polyfill-support",
          path: "node_modules/lit/polyfill-support.js",
          test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || window.ShadyDOM && window.ShadyDOM.force",
          module: false,
        }],
      },
    }),
  ],
};