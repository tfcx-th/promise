let promise = require('./core/promise')

new promise(() => {
  throw new Error(1)
})