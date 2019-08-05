module.exports = (app) => {
  const router = require('express').Router()
  const path = require('path')

  // developmentの場合はwebpack-dev-serverを利用
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackConfig = require('../../webpack.config')('development')
    const compiler = webpack(webpackConfig)
    app.use(webpackHotMiddleware(compiler, {
      reload: true
    }))
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }))

    router.use(/^\/(?!api|sign-s3).*$/, (req, res, next) => {
      const filename = path.resolve(compiler.outputPath, 'index.html')
      compiler.outputFileSystem.readFile(filename, (err, result) => {
        if (err) {
          return next(err)
        }
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
      })
    })
  } else {
    router.get(/^\/(?!api|sign-s3|assets).*$/, (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', '..', 'dist', 'index.html'))
    })
  }

  return router
}
