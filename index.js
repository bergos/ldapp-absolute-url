var path = require('path')
var url = require('url')

function init (options) {
  options = options || {}

  return function (req, res, next) {
    req.absoluteUrl = function () {
      var absoluteUrl = {
        protocol: this.protocol,
        hostname: this.host,
        port: this.socket.address().port,
        pathname: this.url
      }

      if (absoluteUrl.protocol === 'http' && req.socket.ssl) {
        absoluteUrl.protocol += 's'
      }

      if (options.basePath) {
        absoluteUrl.pathname = path.join(options.basePath, absoluteUrl.pathname)
      }

      // use proxy header fields?
      if (req.app.get('trust proxy')) {
        if ('x-forwarded-proto' in this.headers) {
          absoluteUrl.protocol = this.headers['x-forwarded-proto']
        }

        if ('x-forwarded-host' in this.headers) {
          absoluteUrl.hostname = this.headers['x-forwarded-host']
        }

        if ('x-forwarded-port' in this.headers) {
          absoluteUrl.port = parseInt(this.headers['x-forwarded-port'], 10)
        }
      }

      // ignore port if default http(s) port
      if (absoluteUrl.protocol === 'http' && absoluteUrl.port === 80) {
        absoluteUrl.port = ''
      }

      if (absoluteUrl.protocol === 'https' && absoluteUrl.port === 443) {
        absoluteUrl.port = ''
      }

      return url.format(absoluteUrl)
    }

    next()
  }
}

function initLdapp () {
  this.app.use(init(this.absoluteUrl))
}

initLdapp.init = init

module.exports = initLdapp
