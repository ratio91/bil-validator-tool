import merge from 'webpack-merge';
import common from './webpack.config.common.babel';

export default merge(common, {
  mode: 'production',
  target: 'electron-main',
  entry: './src/index.ts',
  output: {
    filename: './main.prod.js',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
});
