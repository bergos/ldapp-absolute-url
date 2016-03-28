/* global describe, it */

var assert = require('assert')
var absoluteUrl = require('../')

describe('absoluteUrl', function () {
  it('should support ldapp-antjs configuration', function (done) {
    var req = {
      app: {
        get: function () { return null }
      },
      hostname: 'example.org',
      protocol: 'http',
      socket: {
        address: function () { return { port: 123 } }
      },
      url: 'index.html'
    }

    absoluteUrl.call({absoluteUrl: {basePath: 'test'}, app: {use: function (middleware) {
      middleware(req, null, function () {})

      assert.equal(req.absoluteUrl(), 'http://example.org:123/test/index.html')

      done()
    }}})
  })
})
