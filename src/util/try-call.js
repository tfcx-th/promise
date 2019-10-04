function tryCall(argsNum, LAST_ERROR) {
  if (argsNum === 1) {
    return function (fn, a) {
      try {
        return fn(a)
      } catch (e) {
        LAST_ERROR = e
        return LAST_ERROR
      }
    }
  } else if (argsNum === 2) {
    return function (fn, a, b) {
      try {
        fn(a, b)
      } catch (e) {
        LAST_ERROR = e
        return LAST_ERROR
      }
    }
  } else {
    throw new Error('The arguments number must be 1 or 2')
  }
}

module.exports = tryCall