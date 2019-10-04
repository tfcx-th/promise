function getThen(LAST_ERROR) {
  return function (obj) {
    try {
      return obj.then
    } catch (error) {
      LAST_ERROR = error
      return LAST_ERROR
    }
  }
}

module.exports = getThen