// vue.config.js
module.exports = {
  //THere are some known issues with multi-page apps
  //jand using HTML history.pushState routing 
  publicPath: './',

  configureWebpack: {
    devtool: 'source-map'
  }
}