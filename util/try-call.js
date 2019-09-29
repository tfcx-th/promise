function tryCall(argsNum, LAST_ERROR=null, IS_ERROR) {
  if (argsNum === 1) {
    return function (fn, a) {
      try {
        fn(a)
      } catch (error) {
        LAST_ERROR = error
        console.log(LAST_ERROR)
        return IS_ERROR
      }
    }
  } else if (argsNum === 2) {
    return function (fn, a, b) {
      try {
        fn(a, b)
      } catch (error) {
        LAST_ERROR = error
        console.log(LAST_ERROR)
        return IS_ERROR
      }
    }
  } else {
    throw new Error('The arguments number must be 1 or 2')
  }
}

module.exports = tryCall