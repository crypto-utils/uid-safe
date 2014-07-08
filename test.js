
var assert = require('assert')

var uid = require('./')

describe('uid-url', function () {
  describe('uid()', function () {
    it('should return a uid of the correct length', function (done) {
      return uid(18, function (err, val) {
        assert.equal(24, Buffer.byteLength(val))
        done()
      })
    })

    it('should not contain +, /, or =', function (done) {
      return uid(100000, function (err, val) {
        assert(!~val.indexOf('+'))
        assert(!~val.indexOf('/'))
        assert(!~val.indexOf('='))
        done()
      })
    })

  })

  describe('uid.sync()', function () {
    it('should return a uid of the correct length', function () {
      var val = uid.sync(18)
      assert.equal(24, Buffer.byteLength(val))
    })

    it('should not contain +, /, or =', function () {
      var val = uid.sync(100000)
      assert(!~val.indexOf('+'))
      assert(!~val.indexOf('/'))
      assert(!~val.indexOf('='))
    })
  })
})
