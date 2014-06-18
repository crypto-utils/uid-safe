
var crypto = require('crypto')
var mz_crypto = require('mz/crypto')
var escape = require('base64-url').escape

module.exports = uid

function uid(length, cb) {
  if (cb) {
    return crypto.pseudoRandomBytes(length, function (err, buf) {
      if (err) return cb(err)
      cb(null, escapeBuffer(buf))
    })
  }
  return mz_crypto.pseudoRandomBytes(length).then(escapeBuffer)
}

uid.sync = function (length) {
  return escapeBuffer(crypto.pseudoRandomBytes(length))
}

function escapeBuffer(buf) {
  return escape(buf.toString('base64'))
}
