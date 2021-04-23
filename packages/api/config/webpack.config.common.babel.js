import webpack from 'webpack';
import { resolve } from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export default {
  entry: './src/main.ts',
  target: 'node',
  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.build.json' })],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: ['web3', 'pdf-parse'],
  stats: {
    // This is optional, but it hides noisey warnings
    warningsFilter: [
      'node_modules/express/lib/view.js',
      'node_modules/@nestjs/common/utils/load-package.util.js',
      'node_modules/@nestjs/core/helpers/load-adapter.js',
      'node_modules/optional/optional.js',
      'node_modules/@nestjs/core/helpers/optional-require.js',
      'node_modules/@nestjs/core/helpers/optional-require.js',
      (warning) => false,
    ],
  },
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'main.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        include: resolve(__dirname, '../src'),
        options: {},
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      './restConfiguration.json',
    ]),
    new webpack.IgnorePlugin({
      /**
       * There is a small problem with Nest's idea of lazy require() calls,
       * Webpack tries to load these lazy imports that you may not be using,
       * so we must explicitly handle the issue.
       * Refer to: https://github.com/nestjs/nest/issues/1706
       */
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/platform-express',
          'cache-manager',
          'class-validator',
          'class-transformer',
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource);
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
  ],
};
