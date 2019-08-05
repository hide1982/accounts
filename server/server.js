const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')

const app = express()

app.use(express.static(path.resolve(__dirname, '..', 'dist')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(helmet())

app.use('/', require('./router/index')(app))
app.use('/api', require('./router/api'))
app.use('/sign-s3', require('./router/sign-s3'))

module.exports = app
