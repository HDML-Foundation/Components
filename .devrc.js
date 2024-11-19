/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

const { legacyPlugin } = require("@web/dev-server-legacy");

module.exports = {
  preserveSymlinks: true,
  nodeResolve: {
    exportConditions: process.env.MODE === 'dev'
      ? ['development']
      : ['prod'],
  },
  plugins: [
    legacyPlugin({
      polyfills: { webcomponents: false },
    }),
  ],
};
