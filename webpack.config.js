const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CreanWebpackPlugin = require('clean-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const ruleBabel = {
  test: /\.js$/,
  exclude: /(node_modules|bower_components|server)/,
  use: {
    loader: 'babel-loader'
  }
}

const ruleEslint = {
  enforce: 'pre',
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  exclude: /(node_modules|bower_components|server)/,
  options: {
    fix: true
  }
}

const ruleVue = {
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      sass: [
        'vue-style-loader!css-loader!sass-loader',
        {
          loader: 'sass-resources-loader',
          options: {
            resources: path.resolve(__dirname, 'src/assets/sass/_variables.scss')
          }
        }
      ]
    }
  }
}

const ruleCss = {
  test: /\.css$/,
  include: /node_modules/,
  loaders: ['style-loader', 'css-loader']
}

const ruleFile = {
  test: /\.(png|jpg|jpeg|gif|svg)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[hash].[ext]',
        outputPath: 'assets/images/'
      }
    }
  ]
}

const ruleFontFile = {
  test: /\.(eot|svg|ttf|woff|woff2)$/,
  loader: 'file-loader',
  options: {
    outputPath: 'assets'
  }
}

const configCommon = {
  entry: {
    app: [
      'babel-polyfill',
      './src/main.js'
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  module: {
    rules: [
      ruleBabel,
      ruleEslint,
      ruleVue,
      ruleCss,
      ruleFile,
      ruleFontFile
    ]
  }
}

const configDev = {
  entry: {
    app: [
      'webpack-hot-middleware/client'
    ]
  },
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dev'),
    publicPath: '/'
  },
  devtool: '#inline-source-map',
  devServer: {
    hot: true,
    host: '0.0.0.0',
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new StyleLintPlugin({
      fix: true,
      files: ['**/*.vue', '**/*.scss']
    })
  ]
}

const configProd = {
  mode: 'production',
  output: {
    filename: 'assets/[name].[hash].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'assets/vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new CreanWebpackPlugin('dist')
  ],
  performance: { hints: false }
}

module.exports = (env) => {
  return merge(
    configCommon,
    env.production ? configProd : configDev
  )
}
