
var Promise
var pseudoRandomBytes = require('crypto').pseudoRandomBytes
var escape = require('base64-url').escape

module.exports = uid

function uid(length, callback) {
  if (callback) {
    return generateUid(length, callback)
  }

  if (!Promise) {
    Promise = require('native-or-bluebird')
  }

  return new Promise(function (resolve, reject) {
    generateUid(length, function (err, str) {
      if (err) return reject(err)
      resolve(str)
    })
  })
}

uid.sync = function uid_sync(length) {
  return escapeBuffer(pseudoRandomBytes(length))
}

function escapeBuffer(buf) {
  return escape(buf.toString('base64'))
}

function generateUid(length, callback) {
  pseudoRandomBytes(length, function (err, buf) {
    if (err) return cb(err)
    callback(null, escapeBuffer(buf))
  })
}
