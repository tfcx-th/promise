const TFCXPromise = require('../core/index')

TFCXPromise.race = function (iterable) {
  if (!iterable[Symbol.iterator]) {
    return new TFCXPromise((resolve, reject) => {
      reject(new TypeError('The param should be a iterable object'))
    })
  }
  return new TFCXPromise((resolve, reject) => {
    for (let value of iterable) {
      TFCXPromise.resolve(value).then(resolve, reject)
    }
  })
}

module.exports = TFCXPromise