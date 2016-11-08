'use strict';
var webpack = require('webpack');

module.exports = function(_path) {
  return {
    context: _path,
    debug: true,
    devtool: 'cheap-source-map',
    devServer: {
      contentBase: './dist',
      port:8088,
      info: true,
      hot: true,
      inline: true,
      proxy: {
        '*': 'http://cell.com/',
        bypass:function (req,res) {
          if(req.headers.accept.indexOf('html') != -1 || req.url.indexOf('swf') != -1 || req.url.indexOf('png') != -1){
            return false;
          }
          return true;
        }
      }
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
