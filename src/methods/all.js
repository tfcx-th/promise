const TFCXPromise = require('../core/index')

const REJECTED = 'rejected'

TFCXPromise.all = function (iterable) {
  if (!iterable[Symbol.iterator]) {
    return new TFCXPromise((resolve, reject) => {
      reject(new TypeError('The param should be a iterable object'))
    })
  }
  var args = Array.prototype.slice.call(iterable, 0)
  return new TFCXPromise((resolve, reject) => {
    if (iterable.length === 0) return resolve([])
    for (let i = 0; i < args.length; i++) {
      let cur = args[i]
      if (cur instanceof TFCXPromise) {
        if (cur._state === REJECTED) reject(cur)
        cur.then(val => {
          args[i] = val
        }, reject)
      } else {
        args[i] = cur
      }
    }
    return resolve(args)
  })
}

module.exports = TFCXPromise
