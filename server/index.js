const app = require('./server')
const db = require('./db')
const port = process.env.PORT || 8080

db.connect()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.info(`==> 🌎  Listening on port ${port}`)
      }
    })
  })
  .catch(err => {
    console.error('fail start server', err)
  })
