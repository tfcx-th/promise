let promise = require('./src/index')

new promise((resolve) => {
  resolve({
    then: new Error('asd')
  })
}).then(val => {
  console.log(val)
  throw new TypeError('asd')
}, err => {
  console.error(err)
}).catch(reason => {
  console.error(reason)
})
