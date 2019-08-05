import { has, size, each, isPlainObject, isString, isArray } from 'lodash'

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

/*
 * pdfmakeのcontentを作成するためのクラス
 */
export default class PdfMakeContentFactory {
  constructor (option = {}) {
    this.content = []
    this.styles = []
    this.defaultStyle = {}
    this.outputOnlyContent = !!has(option, 'outputOnlyContent')
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
    if (size(styles) > 0) {
      each(STYLE_OPTION_LIST, (style) => {
        if (has(styles, style)) {
          if (style === 'border' && styles[style] === false) {
            val[style] = [false, false, false, false]
          } else if (style === 'heights') {
            this.currentTable.table[style] = styles[style]
          } else if (
            style === 'left' || style === 'top' ||
            style === 'right' || style === 'bottom'
          ) {
            if (!has(val, 'margin')) {
              val.margin = [0, 0, 0, 0]
            }
            val.margin[MARGIN_INDEX_MAP[style]] = styles[style]
          } else if (style === 'borderColor') {
            if (!has(this.currentTable, 'layout')) {
              this.currentTable.layout = {}
            }
            this.currentTable.layout.hLineColor = () => {
              return styles[style]
            }
            this.currentTable.layout.vLineColor = () => {
              return styles[style]
            }
          } else if (style === 'borderWidth') {
            if (!has(this.currentTable, 'layout')) {
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
    if (isPlainObject(val)) {
      each(STYLE_OPTION_LIST, (styleName) => {
        if (has(val, styleName)) {
          this.styleCache[styleName] = val[styleName]
        }
      })
    }

    if (size(styles) > 0) {
      each(STYLE_OPTION_LIST, (styleName) => {
        if (has(styles, styleName)) {
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
    * headerなどのスタイルのセットを登録する
    * @param {object} styles 登録するstyles
    */
  setStyles (styles) {
    this.styles = styles
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

    if (has(styles, 'widths')) {
      each(styles.widths, val => {
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
        if (isPlainObject(val)) {
          objVal = val
        } else if (isString(val) || isArray(val)) {
          objVal = {text: val}
        }

        // widthsの数と列の数が違うとエラーになるので揃える
        const hasWidth = has(objVal, 'width') || has(styles, 'width')
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

    if (isString(text)) {
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
    if (has(columns, COLUMNS)) {
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
        each(this.currentTable.table.body, (val, key) => {
          const length = val.length
          if (key !== 0 && maxCol !== length) fillEmptyCells = true

          if (maxCol < length) maxCol = length
        })
        if (fillEmptyCells) {
          each(this.currentTable.table.body, (val, key) => {
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
    * インスタンス作成の際にoptionで[outputOnlyContent]
    * をtrueにしていた場合は、contentのみを出力する
    */
  output () {
    this._save()
    if (this.outputOnlyContent) {
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
