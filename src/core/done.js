const TFCXPromise = require('./core')

/**
 * The last catch or then may throw an error which cannot be caught
 * A done at the end would throw the error
 */
TFCXPromise.prototype.done = function (onFulfilled, onRejected) {
  const self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, err => {
    setTimeout(() => {
      throw err
    }, 0)
  })
}

module.exports = TFCXPromise