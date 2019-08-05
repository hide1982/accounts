const _ = require('lodash')

const TEXT = 'text'
const TABLE = 'table'
const COLUMNS = 'columns'
const DEFAULT_WIDTH = 'auto'
const STYLE_OPTION_LIST = [
  'fontSize', 'color', 'fillColor', 'width', 'heights', 'border',
  'borderColor', 'borderWidth', 'alignment', 'bold', 'left', 'top',
  'right', 'bottom', 'margin', 'colSpan']

const MARGIN_INDEX_MAP = {
  left: 0,
  top: 1,
  right: 2,
  bottom: 3
}

/**
 * pdfmakeのcontentを作成するためのクラス
 */
class PdfMakeContentFactory {
  constructor (option = {}) {
    this.content = []
    this.styles = []
    this.defaultColor = _.has(option, 'color') ? option.color : null
    this.defaultFontSize = _.has(option, 'fontSize') ? option.fontSize : null
    this.defaultStyle = _.has(option, 'font') ? { font: option.font } : {}
    this.shipmentOnlyContent = !!_.has(option, 'shipmentOnlyContent')
    this.isTakeOverStyle = false
    this._init()
  }

  /**
    * ステータスを初期化
    */
  _init () {
    this.currentType = null
    this.currentTable = {}
    this.currentColumns = []
    this.currentRowIndex = 0
    this._initStyle()
  }

  /**
    * スタイルを初期化
    */
  _initStyle () {
    this.styleCache = {}
  }

  /**
    * widthをwidthsに追加する
    * widthsがbodyの数より少なければbodyの数に合わせる
    * widthを指定されていない場合はautoを追加する
    * @param {string|number} width 追加するwidthの値
    */
  _setWdithToWidths (width) {
    if (this.currentTable.table.body.length > 1) {
      return
    }
    const bodyLength = this.currentTable.table.body[this.currentRowIndex].length
    const widthsLength = this.currentTable.table.widths.length
    if (widthsLength === 0) {
      this.currentTable.table.widths[0] = width
    } else if (bodyLength > widthsLength) {
      while (this.currentTable.table.widths.length < bodyLength) {
        this.currentTable.table.widths.push(DEFAULT_WIDTH)
      }
      this.currentTable.table.widths.push(width)
    } else if (bodyLength === widthsLength) {
      this.currentTable.table.widths.push(width)
    }
  }

  /**
    * 要素にスタイルを追加する
    * @param {object} val styleを追加する要素
    * @param {object} styles 追加するstyle
    */
  _setCachedStyles (val, styles) {
    if (_.size(styles) > 0) {
      _.each(STYLE_OPTION_LIST, (style) => {
        if (_.has(styles, style)) {
          if (style === 'border' && styles[style] === false) {
            val[style] = [false, false, false, false]
          } else if (style === 'heights') {
            this.currentTable.table[style] = styles[style]
          } else if (
            style === 'left' || style === 'top' ||
            style === 'right' || style === 'bottom'
          ) {
            if (!_.has(val, 'margin')) {
              val.margin = [0, 0, 0, 0]
            }
            val.margin[MARGIN_INDEX_MAP[style]] = styles[style]
          } else if (style === 'borderColor') {
            if (!_.has(this.currentTable, 'layout')) {
              this.currentTable.layout = {}
            }
            this.currentTable.layout.hLineColor = () => {
              return styles[style]
            }
            this.currentTable.layout.vLineColor = () => {
              return styles[style]
            }
          } else if (style === 'borderWidth') {
            if (!_.has(this.currentTable, 'layout')) {
              this.currentTable.layout = {}
            }
            this.currentTable.layout.hLineWidth = () => {
              return styles[style]
            }
            this.currentTable.layout.vLineWidth = () => {
              return styles[style]
            }
          } else {
            val[style] = styles[style]
          }
        }
      })
    }
  }

  /**
    * 次の要素にstyleを引き継ぐためのキャッシュ
    * @param {object} val styleをキャッシュする対象の要素
    * @param {object} styles キャッシュするstyle
    */
  _cacheStyle (val, styles) {
    if (_.isPlainObject(val)) {
      _.each(STYLE_OPTION_LIST, (styleName) => {
        if (_.has(val, styleName)) {
          this.styleCache[styleName] = val[styleName]
        }
      })
    }

    if (_.size(styles) > 0) {
      _.each(STYLE_OPTION_LIST, (styleName) => {
        if (_.has(styles, styleName)) {
          this.styleCache[styleName] = styles[styleName]
        }
      })
    }
  }

  /**
    * 直前のstyleを引き継ぐ
    * @param {object} val styleを引き継ぐ要素
    */
  _applyTakeOverStyle (val) {
    this._setCachedStyles(val, this.styleCache)
  }

  /**
   * デフォルトのフォントスタイル指定されていた場合はそれを適用する
   * @param {object} val 設定する要素
   * @param {object} styles 要素に設定してあるstyle
   */
  _setDeraultFontStyle (val, styles) {
    if (this.defaultColor !== null && !_.has(val, 'color') && !_.has(styles, 'color')) {
      val.color = this.defaultColor
    }

    if (this.defaultFontSize !== null && !_.has(val, 'fontSize') && !_.has(styles, 'fontSize')) {
      val.fontSize = this.defaultFontSize
    }
  }

  /**
    * 直前のスタイルを引き継ぐかどうかのフラグ
    * @param {boolean} takeOverStyle style引き継ぎのフラグ true:引き継ぐ false:引き継がない
    */
  takeOverStyle (takeOverStyle) {
    this.isTakeOverStyle = takeOverStyle
    if (!takeOverStyle) {
      this._initStyle()
    }
    return this
  }

  /**
    * takeOverStyleの値を変更せずに、キャッシュされたスタイルのみリセットする
    */
  resetStyle () {
    this._initStyle()
    return this
  }

  setBorderFunc (func) {
    if (this.currentType !== TABLE) return this
    this.currentTable.layout = func
    return this
  }

  /**
    * デフォルトで利用するスタイル
    * @param {object} defaultStyle 登録するデフォクト値
    */
  setDefaultStyle (defaultStyle) {
    this.defaultStyle = defaultStyle
    return this
  }

  /**
    * headerなどのスタイルのセットを登録する
    * @param {object} styles 登録するstyles
    */
  setStyles (styles) {
    this.styles = styles
    return this
  }

  /**
    * デフォルトのフォントサイズとフォントカラーを設定する
    * 特別指定がない限りここで設定したフォントスタイルを適用する
    * @param {object} style 登録するフォントスタイル
    * @param {string} style.color フォントカラー
    * @param {string} style.fontSize フォントサイズ
    */
  setDefaultFontStyle (style) {
    if (_.has(style, 'color')) this.defaultColor = style.color
    if (_.has(style, 'color')) this.defaultFontSize = style.fontSize
    return this
  }

  /**
    * tableを作成する row関数で行を追加 col関数で列を追加する
    * @param {string|object} val tableに追加する要素
    * @param {object} styles 適用するstyle
    */
  table (val, styles = {}) {
    this._save()
    this.currentType = TABLE

    let table = {
      table: {
        body: [[[]]],
        widths: []
      }
    }

    this.currentTable = table

    if (_.has(styles, 'widths')) {
      _.each(styles.widths, val => {
        this.currentTable.table.widths.push(val)
      })
    }

    this.col(val, styles)

    return this
  }

  /**
    * tableに行を追加する
    * @param {string|object} val 追加する要素
    * @param {object} styles 適用するstyle
    */
  row (val, styles = {}) {
    if (this.currentType !== TABLE) return this
    this.currentRowIndex++
    this.currentTable.table.body.push([])
    this.col(val, styles)
    return this
  }

  /**
    * tableまたはcolumnsに列を追加する
    * @param {string|object} val 追加する要素
    * @param {object} styles 適用するstyle
    */
  col (val, styles = {}) {
    switch (this.currentType) {
      case TABLE:
        // 値をオブジェクトにする
        let objVal
        if (_.isPlainObject(val)) {
          objVal = val
        } else if (_.isString(val) || _.isArray(val)) {
          objVal = {text: val}
        }

        // widthsの数と列の数が違うとエラーになるので揃える
        const hasWidth = _.has(objVal, 'width') || _.has(styles, 'width')
        if (hasWidth) {
          const _width = objVal.width || styles.width
          this._setWdithToWidths(_width)
        } else {
          this._setWdithToWidths(DEFAULT_WIDTH)
        }

        this._setCachedStyles(objVal, styles)

        if (this.isTakeOverStyle) {
          this._cacheStyle(objVal, styles)
          this._applyTakeOverStyle(objVal)
        }

        this._setDeraultFontStyle(objVal, styles)

        if (
          this.currentTable.table.body[this.currentRowIndex].length === 1 &&
          this.currentTable.table.body[this.currentRowIndex][0].length === 0
        ) {
          this.currentTable.table.body[this.currentRowIndex] = [objVal]
        } else {
          this.currentTable.table.body[this.currentRowIndex].push(objVal)
        }
        break
      case COLUMNS:
        this.content.push(this.currentColumns)
        break
    }
    return this
  }

  /**
    * 入力された値をそのまま追加する
    * デフォルトのフォントスタイルは適用しない
    * @param {string|object} any 追加する要素
    */
  add (any) {
    this._save()
    this.content.push(any)
    return this
  }

  /**
    * テキストを追加する
    * @param {string|object} text 追加する要素
    * @param {object} styles 適用するスタイル
    */
  text (text, styles = {}) {
    this._save()
    let objVal

    if (_.isString(text)) {
      objVal = {
        text: text
      }
    } else {
      objVal = text
    }

    this._setCachedStyles(objVal, styles)

    if (this.isTakeOverStyle) {
      this._cacheStyle(objVal, styles)
      this._applyTakeOverStyle(objVal)
    }

    this._setDeraultFontStyle(objVal, styles)

    this.content.push(objVal)

    return this
  }

  /**
    * columnsを追加する
    * col関数で列を追加する
    * @param {object} columns 追加する要素
    */
  columns (columns) {
    this._save()
    this.currentType = COLUMNS
    if (_.has(columns, COLUMNS)) {
      this.currentColumns = columns
    } else {
      this.currentColumns.push(columns)
    }
    return this
  }

  /**
    * 指定された値の分位置を下げる
    * @param {number} val 位置を下げる値
    */
  down (val) {
    this.text('', {
      margin: [0, val, 0, 0]
    })
    return this
  }

  /**
    * tableやcolumnsの内容を確定してcontentに追加する
    */
  _save () {
    switch (this.currentType) {
      case TEXT:
        break
      case TABLE:
        // tableの列の数が揃わないとエラーになるので全ての列数を最大の列数に揃える
        let maxCol = 0
        let fillEmptyCells = false
        _.each(this.currentTable.table.body, (val, key) => {
          const length = val.length
          if (key !== 0 && maxCol !== length) fillEmptyCells = true

          if (maxCol < length) maxCol = length
        })
        if (fillEmptyCells) {
          _.each(this.currentTable.table.body, (val, key) => {
            while (maxCol > this.currentTable.table.body[key].length) {
              const emptyCell = { text: '' }
              if (this.isTakeOverStyle) {
                this._applyTakeOverStyle(emptyCell)
              }
              this.currentTable.table.body[key].push(emptyCell)
            }
          })
        }
        this.content.push(Object.assign({}, this.currentTable))
        break
      case COLUMNS:
        this.content.push(this.currentColumns.slice(0))
        break
    }
    this._init()

    return this
  }

  /**
    * 完成したcontentを出力する
    * インスタンス作成の際にoptionで[shipmentOnlyContent]
    * をtrueにしていた場合は、contentのみを出力する
    */
  shipment () {
    this._save()
    if (this.shipmentOnlyContent) {
      return this.content
    } else {
      return {
        content: this.content,
        styles: this.styles,
        defaultStyle: this.defaultStyle
      }
    }
  }
}

/**
 * 数値を¥〇〇,〇〇〇-の形式に置換する
 * @param {number} num 置換する値
 * @param {boolean} enSymbol 先頭に[¥]をつけるかどうかのフラグ true:つける, false:つけない
 * @param {boolean} hyphen 末尾に[-]をつけるかどうかのフラグ true:つける, false:つけない
 */
function formatMoney (num, enSymbol = false, hyphen = false) {
  if (num) {
    let result = num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    if (enSymbol) {
      result = `¥${result}`
    }
    if (hyphen) {
      result = `${result}-`
    }
    return result
  }
  return ''
}

/**
 * 日付操作の関数
 */
class Opate {
  constructor (date, format) {
    this.baseDate = date ? new Date(date) : new Date()
    this.format = format || 'YYYY-MM-DD'
  }

  _applyFormat (format, date) {
    const _date = date || this.baseDate
    const y = '' + _date.getFullYear()
    const m = '' + (_date.getMonth() + 1)
    const d = '' + _date.getDate()
    const h = '' + _date.getHours()
    const mi = '' + _date.getMinutes()
    const s = '' + _date.getSeconds()
    const ms = '' + _date.getMilliseconds()
    const w = '' + _date.getDay()
    let _format = format || this.format
    _format = _format.replace(/YYYY/g, y)
    _format = _format.replace(/YY/g, y.slice(-2))
    _format = _format.replace(/MM/g, ('0' + m).slice(-2))
    _format = _format.replace(/M/g, m)
    _format = _format.replace(/DD/g, ('0' + d).slice(-2))
    _format = _format.replace(/D/g, d)
    _format = _format.replace(/hh/g, ('0' + h).slice(-2))
    _format = _format.replace(/mm/g, ('0' + mi).slice(-2))
    _format = _format.replace(/ss/g, ('0' + s).slice(-2))
    if (_format.match(/S/g)) {
      const milliSeconds = ('00' + ms).slice(-3)
      let length = _format.match(/S/g).length
      for (let i = 0; i < length; i++) { _format = _format.replace(/S/, milliSeconds.substring(i, i + 1)) }
    }
    _format = _format.replace(/EEEE/g, this.week(w, 'en-long'))
    _format = _format.replace(/EEE/g, this.week(w, 'en-short'))
    _format = _format.replace(/EE/g, this.week(w, 'ja-long'))
    _format = _format.replace(/E/g, this.week(w, 'ja-short'))
    return _format
  }

  week (week, format) {
    let weeks = {
      'en-long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      'en-short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      'ja-long': ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      'ja-short': ['日', '月', '火', '水', '木', '金', '土']
    }
    const _format = format || 'en-long'
    if (!weeks[_format] || !weeks[_format][week]) {
      return ''
    } else {
      return weeks[_format][week]
    }
  }

  get (format) {
    if (format === undefined) {
      if (!this.date) {
        this._set()
      }
      return this.date
    } else {
      return this._applyFormat(format, this.baseDate)
    }
  }

  getBaseDate () {
    return this.baseDate
  }

  getMonth (num) {
    this._checkArg(num)
    const _num = num || 0
    return this.baseDate.getMonth() + 1 + _num
  }

  getFirstDayOfMonth (num) {
    this._checkArg(num)
    const _num = num || 0
    const _date = new Date(this.baseDate.getFullYear(), this.baseDate.getMonth() + _num, 1)
    return this._applyFormat(this.format, _date)
  }

  getLastDayOfMonth (num) {
    this._checkArg(num)
    const _num = num || 0
    const _date = new Date(this.baseDate.getFullYear(), this.baseDate.getMonth() + 1 + _num, 0)
    return this._applyFormat(this.format, _date)
  }

  getDaysOfMonth (num) {
    this._checkArg(num)
    const _num = num || 0
    const _date = new Date(this.baseDate.getFullYear(), this.baseDate.getMonth() + 1 + _num, 0)
    return _date.getDate()
  }
  next (num) {
    this._checkArg(num)
    const _num = num || 1
    this.baseDate.setDate(this.baseDate.getDate() + Number(_num))
    this._set()
    return this
  }

  prev (num) {
    this._checkArg(num)
    const _num = num || 1
    this.baseDate.setDate(this.baseDate.getDate() - Number(_num))
    this._set()
    return this
  }

  setFormat (format) {
    this.format = format || 'YYYY-MM-DD hh:mm:ss'
    this._set()
    return this
  }

  now () {
    this.baseDate = new Date()
    this._set()
    return this
  }

  setDate (date) {
    this.baseDate = date ? new Date(date) : new Date()
    this._set()
    return this
  }

  getDiffDay (date) {
    const base = this.baseDate.getTime()
    const target = new Date(date).getTime()
    const diff = target - base
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
  }

  _set () {
    this.date = this._applyFormat(this.format, this.baseDate)
  }

  _checkArg (arg) {
    if (arg !== undefined && typeof arg !== 'number') {
      console.log('数値を入力してください')
    }
  }
}

module.exports = {
  PdfMakeContentFactory: PdfMakeContentFactory,
  formatMoney: formatMoney,
  Opate: Opate
}
