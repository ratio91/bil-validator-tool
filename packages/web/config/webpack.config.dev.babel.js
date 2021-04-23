import merge from 'webpack-merge';
import common from './webpack.config.common.babel';

export default merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'react-hot-loader/webpack',
        include: /node_modules/,
      },
    ],
  },
  devtool: 'source-map',
});
