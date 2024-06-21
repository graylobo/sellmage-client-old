const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig, { env, paths }) => {
      // Fallback configuration to resolve 'fs' module not found error
      webpackConfig.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        http: false,
        https: false,
        stream: false,
        zlib: false,
        crypto: false,
      };

      return webpackConfig;
    },
  },
};
