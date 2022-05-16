module.exports = {
  publicPath: process.env.VUE_APP_API_URL === '193.40.156.142'
    ? '/'
    : '/services/cognate/front',                    
  outputDir: 'dist',
  assetsDir: 'static',
}