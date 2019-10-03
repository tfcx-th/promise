let promise = require('./src/core/promise')

new promise((resolve) => {
  resolve(11111)
}).then(val => {
  // console.log(val)
  return 1234
}).then(val => {
  console.log(val)
})