/**
 * To check the type correctly
 */

const TYPE_LIST = {
  '[object Boolean]'  : 'boolean',
  '[object Number]'   : 'number',
  '[object String]'   : 'string',
  '[object Function]' : 'function',
  '[object Array]'    : 'array',
  '[object Date]'     : 'date',
  '[object RegExp]'   : 'regExp',
  '[object Undefined]': 'undefined',
  '[object Null]'     : 'null',
  '[object Object]'   : 'object'
}

function typeOf(val) {
  return TYPE_LIST[Object.prototype.toString.call(val)];
}

module.exports = typeOf