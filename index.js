var absoluteUrl = require('absolute-url')

function init (options) {
  return absoluteUrl(options)
}

function initLdapp () {
  this.app.use(init(this.absoluteUrl))
}

initLdapp.init = init

module.exports = initLdapp
