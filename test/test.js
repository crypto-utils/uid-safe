var assert = require('assert')
var crypto = require('crypto')
var proxyquire = require('proxyquire')

var Promise = global.Promise || require('bluebird')

var uid = proxyquire('..', {
  crypto: {
    randomBytes: randomBytes
  }
})

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

    describe('when PRNG not seeded', function () {
      before(function () {
        randomBytes.seeded = false
      })

      after(function () {
        randomBytes.seeded = true
      })

      it('should still generate uid', function () {
        return uid(18).then(function (val) {
          assert.equal(24, Buffer.byteLength(val))
        })
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

    describe('when PRNG not seeded', function () {
      before(function () {
        randomBytes.seeded = false
      })

      after(function () {
        randomBytes.seeded = true
      })

      it('should still generate uid', function (done) {
        uid(18, function (err, val) {
          if (err) return done(err)
          assert.equal(24, Buffer.byteLength(val))
          done()
        })
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

  describe('when PRNG not seeded', function () {
    before(function () {
      randomBytes.seeded = false
    })

    after(function () {
      randomBytes.seeded = true
    })

    it('should still generate uid', function () {
      var val = uid.sync(18)
      assert.equal(24, Buffer.byteLength(val))
    })
  })
})

function randomBytes(length, callback) {
  if (randomBytes.seeded !== false) {
    return crypto.randomBytes(length, callback)
  }

  // The crazy not seeded error
  var err = new Error('error:24064064:random number generator:SSLEAY_RAND_BYTES:PRNG not seeded')

  if (!callback) {
    throw err
  }

  callback(err)
}
