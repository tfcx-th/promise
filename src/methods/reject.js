const TFCXPromise = require('../core/index')

TFCXPromise.reject = function (reason) {
  return new TFCXPromise((resolve, reject) => {
    reject(reason)
  })
}

module.exports = TFCXPromise