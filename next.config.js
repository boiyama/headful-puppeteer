/* eslint-disable @typescript-eslint/no-var-requires */
const withTypescript = require("@zeit/next-typescript");
const webpack = require("webpack");

module.exports = withTypescript({
  distDir: "dist",
  webpack: config => {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    return config;
  }
});
