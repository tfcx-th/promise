const TFCXPromise = require('./core')

TFCXPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

module.exports = TFCXPromise