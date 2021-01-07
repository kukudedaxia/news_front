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
      title: 'Beeto',
    },
  },
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
