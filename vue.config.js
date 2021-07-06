const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const entryGenerator = require('./generator/entryGenerator');

module.exports = {
  publicPath: process.env.PUBLIC_PATH,
  outputDir: 'beeto',
  lintOnSave: true,
  assetsDir: process.env.NODE_ENV !== 'development' ? 'assets' : 'dev-assets',
  indexPath: 'index.html',
  filenameHashing: true,
  productionSourceMap: false,
  pages: {
    web: {
      entry: './src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  //可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
  configureWebpack: config => {
    config.plugins = config.plugins.concat(
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: process.env.PUBLIC_PATH,
        writeToFileEmit: true,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = [];
          entrypoints.web.forEach(fileName => {
            if (!fileName.endsWith('.map')) {
              entrypointFiles.push(process.env.PUBLIC_PATH + fileName);
            }
          });
          let res = {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
          entryGenerator(res);
          return {
            web: res,
          };
        },
      }),
    );
  },
  //允许对内部的 webpack 配置进行更细粒度的修改。
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

    // 构建体积分析工具
    if (process.env.use_analyzer) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    }
  },
  devServer: {
    hot: true,
    port: 8080,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://m.whale.weibo.com/',
      },
      '/liveApi': {
        target: 'http://10.92.160.246:8080/',
        pathRewrite: { '^/liveApi': '' },
        // pathRewrite: { '^/api': '' },
      },
    },
  },
};
