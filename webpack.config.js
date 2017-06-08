const webpack = require('webpack');
const path = require('path');

const SRC_PATH = './src';
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks(module) {
        const context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      },
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
  }),
  new webpack.ProvidePlugin({
      React: 'react',
      PropTypes: 'prop-types',
  }),
];

if (IS_DEV) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
} else {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    })
  )
}

module.exports = {
  context: path.resolve(__dirname, SRC_PATH),
  entry: {
    index: './index',
  },

  output: {
    path: path.join(__dirname, 'assets'),
    publicPath: '/',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /\/node_modules\//,
        loader: 'babel-loader',
      },
    ],
  },
  plugins,
  devServer: {
    publicPath: '/',
    historyApiFallback: true,
    port: 3000,
    compress: !IS_DEV,
    inline: IS_DEV,
    hot: IS_DEV,
    host: 'localhost',
    disableHostCheck: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      },
    },
  },
};
