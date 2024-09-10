// vue.config.js
module.exports = {
    productionSourceMap: false, // 禁用 source maps
    configureWebpack: config => {
      if (process.env.NODE_ENV === 'production') {
        // 为生产环境修改配置
        config.optimization = {
          minimize: true, // 启用代码压缩
          splitChunks: {
            chunks: 'all',
            minSize: 20000, // 20 KB
            maxSize: 50000, // 50 KB
            cacheGroups: {
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
            },
          },
      
        };
      }
    },
  };
  