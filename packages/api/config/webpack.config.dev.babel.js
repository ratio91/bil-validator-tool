import merge from 'webpack-merge';
import common from './webpack.config.common.babel';

export default merge(common, {
  mode: 'development',
  devtool: 'source-map',
});
