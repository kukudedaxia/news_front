// const path = require("path");
module.exports = {
  publicPath: process.env.PUBLIC_PATH,
  outputDir: 'beeto',
  lintOnSave: true,
  assetsDir: process.env.NODE_ENV !== 'development' ? 'assets' : 'dev-assets',
  indexPath: 'index.html',
  filenameHashing: true,
  productionSourceMap: false,
  pages: {
    index: {
      // page 的入口
      entry: './src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },

  chainWebpack: config => {
    // i18单文件组件
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end();

    // 切包
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    });
  },
  devServer: {
    hot: false,
    port: 8081,
    disableHostCheck: true,
  },
};
