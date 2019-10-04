const TFCXPromise = require('../core/index')

TFCXPromise.prototype.finally = function (cb) {
  return this.then(value => {
    return TFCXPromise.resolve(cb()).then(() => {
      return value
    })
  }, err => {
    return Promise.reject(cb()).then(() => {
      throw err
    })
  })
}

module.exports = TFCXPromise