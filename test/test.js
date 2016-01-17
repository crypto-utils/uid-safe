var assert = require('assert')
var uid = require('..')

var Promise = global.Promise || require('bluebird')

// Add Promise to mocha's global list
global.Promise = global.Promise

describe('uid()', function () {
  describe('with global Promise', function () {
    before(function () {
      global.Promise = Promise
    })

    after(function () {
      global.Promise = undefined
    })

    it('should return a uid of the correct length', function () {
      return uid(18).then(function (val) {
        assert.equal(24, Buffer.byteLength(val))
      })
    })

    it('should not contain +, /, or =', function () {
      return uid(100000).then(function (val) {
        assert(!~val.indexOf('+'))
        assert(!~val.indexOf('/'))
        assert(!~val.indexOf('='))
      })
    })
  })

  describe('without global Promise', function () {
    before(function () {
      global.Promise = undefined
    })

    after(function () {
      global.Promise = Promise
    })

    it('should require callback', function () {
      assert.throws(function () {
        uid(18)
      }, /argument callback.*required/)
    })

    it('should error for bad callback', function () {
      assert.throws(function () {
        uid(18, 'silly')
      }, /argument callback.*function/)
    })

    it('should return a uid of the correct length', function (done) {
      uid(18, function (err, val) {
        if (err) return done(err)
        assert.equal(24, Buffer.byteLength(val))
        done()
      })
    })

    it('should not contain +, /, or =', function (done) {
      uid(1000000, function (err, val) {
        if (err) return done(err)
        assert(!~val.indexOf('+'))
        assert(!~val.indexOf('/'))
        assert(!~val.indexOf('='))
        done()
      })
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
