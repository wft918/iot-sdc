/**
 * 配置参考:
 * https://cli.vuejs.org/zh/config/
 */
//const url = 'http://192.168.67.66:8181';
const url = 'http://planplat-gateway:9080';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    // svg图片显示配置
    // const svgRule = config.module.rule('svg');
 
    // svgRule.uses.clear();
 
    // svgRule
    //   .use('babel-loader')
    //   .loader('babel-loader')
    //   .end()
    //   .use('vue-svg-loader')
    //   .loader('vue-svg-loader');
      
    // 忽略的打包文件
    config.externals({
      'axios': 'axios'
    });
    const entry = config.entry('app');
    entry
      .add('babel-polyfill')
      .end();
    entry
      .add('classlist-polyfill')
      .end()
  },

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
         jQuery: "jquery",
         $: "jquery",
         "windows.jQuery": "jquery"
       }),
     new CopyWebpackPlugin([
         { from: 'node_modules/@liveqing/liveplayer/dist/component/crossdomain.xml'},
         { from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer.swf'},
         { from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer-lib.min.js', to: 'js/'},
     ])
   ]
  },

  // 配置转发代理
  devServer: {
    disableHostCheck: true,
    port: 8080,
    proxy: {
      '/': {
        target: url,
        ws: true, // 需要websocket 开启
        pathRewrite: {
          '^/': '/'
        }
      }
      // 3.5 以后不需要再配置
    }
  }
};
