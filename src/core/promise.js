'use strict';

const typeOf = require('../util/type')
const tryCall = require('../util/try-call')
const isArray = require('../util/is-array')
const asap = require('asap/raw')

const IS_ERROR = 'Is_A_Error'
let LAST_ERROR = null

const tryCallOne = tryCall(1, LAST_ERROR, IS_ERROR)
const tryCallTwo = tryCall(2, LAST_ERROR, IS_ERROR)

function getThen(obj) {
  try {
    return obj.then
  } catch (error) {
    LAST_ERROR = error
    return IS_ERROR
  }
}

// define a empty function
const NOOP = function () {}

/**
 * States:
 * PENDING - pending, initial state of a promise.
 * FULFILLED - fulfilled, representing a successful operation
 * REJECTED - rejected, representing a failed operation
 * 
 * Only when its state is pending, the promise can change its state
 * Once a promise is fulfilled or rejected, it is immutable
 */
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

module.exports = TFCXPromise

/**
 * @param {function} fn - fn has two param, resolve and reject, both of them are functions
 */
function TFCXPromise(fn) {
  if (!(this instanceof TFCXPromise)) {
    throw new TypeError('use \'new\' when calling TFCXPromise constructor')
  }
  if (typeof fn !== 'function') {
    throw new TypeError('TFCXPromise\' arguments must be function')
  }
  // store the state of TFCXPromise
  // the state will be pending after being initialized
  this._state = PENDING
  // store the value or error once fulfilled or rejected
  this._value = null
  // store Handlers, can be a single object or a array is necessary
  this._deferreds = null
  if (fn === NOOP) return
  doResolve(fn, this)
}

TFCXPromise.prototype.then = function (onFulfilled, onRejected) {
  var result = new TFCXPromise(NOOP)
  handle(this, new Handler(onFulfilled, onRejected, result))
  return result
}

function handle(self, deferred) {
  while (self._value instanceof TFCXPromise) {
    self = self._value
  }
  if (self._state === PENDING) {
    if (self._deferreds === null) {
      self._deferreds = deferred
      return
    }
    if (!isArray(self._deferreds)) {
      self._deferreds = [self._deferreds, deferred]
      return
    }
    self._deferreds.push(deferred)
    return
  }
  handlerResolved(self, deferred)
}

/**
 * 
 */
function handlerResolved(self, deferred) {
  asap(function () {
    const cb = self._state === FULFILLED ? deferred.onFulfilled : deferred.onRejected
    if (cb === null) {
      if (self._state === FULFILLED) {
        resolve(deferred.promise, self._value)
      } else {
        reject(deferred.promise, self._value)
      }
      return
    }
    var res = tryCallOne(cb, self._value)
    console.log(self._value)
    // console.log(res + 'asda')
    if (res === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR)
    } else {
      resolve(deferred.promise, res)
    }
  })
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeOf(onFulfilled) === 'function' ? onFulfilled : null
  this.onRejected = typeOf(onRejected) === 'function' ? onRejected : null
  this.promise = promise
}

/**
 * Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
 */
function resolve(self, value) {
  // If promise and value refer to the same object, reject promise with a TypeError
  if (self === value) {
    return reject(self, new TypeError('A promise cannot be resolved with itself.'))
  }
  if (value && (typeOf(value) === 'function' || typeOf(value) === 'object')) {
    var then = getThen(value)
    // then is not exist
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR)
    }
    if (then === self.then && value instanceof TFCXPromise) {
      self._value = value
      finale(self)
      return
    }
    // thenable object, object with a then method
    if (typeOf(then) === 'function') {
      doResolve(then.bind(value), self)
      return
    }
  }
  self._state = FULFILLED
  self._value = value
  finale(self)
}

/**
 * Set promise to REJECTED
 */
function reject(self, value) {
  self._state = REJECTED
  self._value = value
  finale(self)
}

/**
 * Judge _deferreds is a array or not and call every deferred in it
 */
function finale(self) {
  console.log(`self._deferredState = ${self._deferreds}`)
  if (self._deferreds === null) return
  if (self._deferreds && !isArray(self._deferreds)) {
    handle(self, self._deferreds)
    self._deferreds = null
  } else {
    self._deferreds.forEach(deferred => {
      handle(self, deferred)
    })
    self._deferreds = null
  }
}

/**
 * Make sure that resolve() or reject() can only be called once
 * It is meaningless to call reject() after calling resolve() or resolve() after reject()
 * If neither of them are called and fn throw an error, call reject()
 */
function doResolve(fn, promise) {
  var done = false
  var result = tryCallTwo(fn, value => {
    if (done) return
    done = true
    resolve(promise, value)
  }, err => {
    if (done) return
    done = true
    reject(promise, err)
  })
  if (!done && result === IS_ERROR) {
    done = true
    reject(promise, LAST_ERROR)
  }
}