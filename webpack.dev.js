import {merge} from 'webpack-merge';
import common from './webpack.common.js'

export default merge(common, {
  mode: 'development',
  devtool: "inline-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
});