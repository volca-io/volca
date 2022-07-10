const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const { NormalModuleReplacementPlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const { isLocal } = slsw.lib.webpack;

module.exports = {
  // bundling mode
  mode: isLocal ? 'development' : 'production',
  devtool: isLocal ? 'eval' : 'source-map',

  // entry files
  entry: slsw.lib.entries,

  // in order to ignore built-in modules like path, fs, etc.
  target: 'node',

  // in order to ignore all modules in node_modules folder
  externals: [nodeExternals(), 'aws-sdk', 'prettier'],

  // output bundles (location)
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },

  // file resolutions
  resolve: {
    extensions: ['.ts', '.js'],
  },

  // loaders
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  // For copying migrations into bundle
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'migrations/*', to: './' }],
    }),
  ],
};
