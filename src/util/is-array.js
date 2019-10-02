const typeOf = require('./type')

function isArray(obj) {
  return typeOf(obj) === 'array'
}

module.exports = isArray