const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** */
const baseConfig = (mode) => ({
  entry: ['./src/index.js'],
  module: {
    rules: [
      {
        include: path.resolve(fs.realpathSync(process.cwd()), '.'), // CRL
        loader: require.resolve('babel-loader'),
        options: {
          // Save disk space when time isn't as important
          cacheCompression: true,
          cacheDirectory: true,
          compact: true,
          envName: mode,
        },
        test: /\.(js|mjs|jsx)$/,
      },
      {
        loader: 'html-loader',
        test: /\.html$/,
      },
      {
        test: /\.css$/, // Targets all CSS files
        use: ['style-loader', 'css-loader'], // Uses these loaders
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: true,
      }),
    ],
  },
  output: {
    filename: 'mirador-annotation-editor.js',
    hashFunction: 'md5',
    library: 'MiradorAnnotationEditor',
    libraryExport: 'default',
    libraryTarget: 'es',
    path: path.join(__dirname, 'es'),
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /@blueprintjs\/(core|icons)/, // ignore optional UI framework dependencies
    }),
  ],
  resolve: {
    fallback: { url: false },
    extensions: ['.js'],
  },
});

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const config = baseConfig(options.mode);

  if (isProduction) {
    return {
      ...config,
      devtool: 'source-map',
      mode: 'production',
      plugins: [
        ...(config.plugins || []),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      ],
    };
  }

  return {
    ...config,
    output: {
      filename: 'demo.js',
      path: path.join(__dirname, 'demo/dist'),
      publicPath: '/',
    },
    devServer: {
      hot: true,
      static: [
        './demo/dist/',
      ],
    },
    devtool: 'eval-source-map',
    mode: 'development',
    entry: ['./demo/src/index.js'],
    plugins: [
      ...(config.plugins || []),
      new HtmlWebpackPlugin({ template: path.join(__dirname, 'demo/src/index.html') }),
      new ReactRefreshWebpackPlugin(),
    ],
  };
};
