const mongoose = require('mongoose')

// 開発環境でデータベースを変更
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/accounts2'

// mongoDB
const mongooseOption = {}
mongoose.set('debug', true)

module.exports = {
  connect: () => {
    return new Promise((resolve, reject) => {
      mongoose.connect(dbUrl, mongooseOption, dbErr => {
        if (dbErr) {
          reject(dbErr)
        } else {
          console.log('db connected')
          resolve()
        }
      })
    })
  }
}
