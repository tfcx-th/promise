const TFCXPromise = require('../core/index')
const typeOf = require('../util/type')

TFCXPromise.resolve = function (value) {
  if (value instanceof TFCXPromise) {
    return value
  }
  if ([null, undefined, true, false, 0, ''].indexOf(value) !== -1) {
    return valueToTFCXPromise(value)
  }
  if (typeOf(value) === 'object' || typeOf(value) === 'function') {
    try {
      let then = value.then
      if (typeOf(then) === 'function') {
        return new TFCXPromise(then.bind(value))
      }
    } catch (err) {
      return new TFCXPromise((resolve, reject) => {
        reject(err)
      })
    }
  }
  return valueToTFCXPromise(value)
}

function valueToTFCXPromise(value) {
  let p = new TFCXPromise(() => {})
  p._state = 'fulfilled'
  p._value = value
  return p
}

module.exports = TFCXPromise