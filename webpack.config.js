const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          },
        }]
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  }
};

const backgroundAndStaticConfig = merge(baseConfig, {
  entry: {
    background: './src/background.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },

  devtool: 'sourcemap',

  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: '' },
      { from: 'src/assets', to: 'assets' },
      { from: 'src/_locales', to: '_locales' },
    ])
  ]
});

const optionsConfig = merge(baseConfig, {
  entry: {
    options: './src/options/options.js'
  },

  output: {
    path: path.resolve(__dirname, './dist/options'),
    filename: '[name].js',
  },

  devtool: 'sourcemap',

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/options/options.html',
      filename: 'options.html'
    }),
    new ExtractTextPlugin('[name].css')
  ]
});

const popupConfig = merge(baseConfig, {
  entry: {
    popup: './src/popup/popup.js'
  },

  output: {
    path: path.resolve(__dirname, './dist/popup'),
    filename: '[name].js',
  },

  devtool: 'sourcemap',
  
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/popup/popup.html',
      filename: 'popup.html'
    }),
    new ExtractTextPlugin('[name].css')
  ]
});


module.exports = [
  backgroundAndStaticConfig,
  optionsConfig,
  popupConfig
];
