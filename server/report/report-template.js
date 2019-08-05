const path = require('path')
const PdfPrinter = require('pdfmake/src/printer')
const fs = require('fs')
const { each } = require('lodash')
const request = require('request').defaults({ encoding: null })
const config = require('../config')
const util = require('../util')

const download = function (data) {
  return new Promise((resolve, reject) => {
    if (!data.imageUrl) {
      resolve(data)
    } else {
      request.head(data.imageUrl, function (err, res) {
        if (err) {
          reject(err)
        } else {
          const extension = res.headers['content-type'].split('/')[1]
          const imagePath = path.resolve(config.tmpPath, `tmp.${extension}`)
          request(data.imageUrl)
            .pipe(fs.createWriteStream(imagePath))
            .on('close', () => {
              data.imagePath = imagePath
              resolve(data)
            })
        }
      })
    }
  })
}

const taxRate = 0.08

const createContent = data => {
  return new Promise(function (resolve, reject) {
    try {
      // const primaryColor = '#98A9D4'
      // const secondaryColor = '#DADFF0'
      // const primaryFontColor = '#444'
      // const colorWhite = '#fff'

      const primaryColor = '#444'
      const secondaryColor = '#eee'
      const primaryFontColor = '#444'
      const colorWhite = '#fff'

      const listMinRows = 8

      const listMargin = { margin: [3, 2, 3, 2] }
      const listMarginFirstCol = { margin: [10, 2, 3, 2] }
      const listMarginLastCol = { margin: [10, 2, 10, 2] }
      const totalStylePrimary = {
        color: colorWhite,
        bold: true,
        fillColor: primaryColor
      }
      const totalStyleWhite = {
        bold: true,
        fillColor: colorWhite
      }

      const title = data.title
      const clientName = `${data.clientName}   御中`
      const dateOfIssue = `発行日 : ${new util.Opate(data.dateOfIssue).get('YYYY年MM月DD日')}`
      const zipcode = `〒${data.zipcode}`
      const address1 = data.address1
      const address2 = data.address2
      const userName = data.userName
      const phone = data.phone
      const description = data.description
      const projectTitle = data.projectTitle
      const totalAmountMainLabel = data.totalAmountMainLabel
      const detailDescription = data.detailDescription
      const subtotal = data.subtotal
      const tax = Math.floor(data.totalAmount * taxRate)
      const isShowTax = data.isShowTax
      let totalAmount = data.totalAmount
      if (isShowTax) {
        totalAmount += tax
      }
      const note = data.note

      const factory = new util.PdfMakeContentFactory({
        font: 'GenShinGothic',
        color: primaryFontColor,
        fontSize: 9
      })
      // 会社印
      if (data.imagePath) {
        factory
          .add({
            image: data.imagePath,
            width: 30,
            absolutePosition: {x: 455, y: 175}
          })
      }
      factory
        // 帯
        .table('', {
          width: '*',
          heights: 11,
          fillColor: primaryColor,
          border: false
        })
        .down(15)
        // 帳票名
        .text(title, {
          fontSize: 16,
          color: primaryColor,
          bold: true,
          alignment: 'center'
        })
        .down(30)
        .takeOverStyle(true)
        // クライアント名
        .table(clientName, {
          width: 310,
          fontSize: 12,
          bold: true,
          border: false,
          margin: [0, 31, 0, 0]
        })
        // ユーザー情報
        .col({
          type: 'none',
          ul: [
            dateOfIssue,
            ` `,
            zipcode,
            address1,
            address2,
            userName,
            phone
          ]}, {
          width: '*',
          fontSize: 8,
          margin: [20, 0, 0, 0]
        })
        .takeOverStyle(false)
        .down(25)
        // 合計金額
        .text(description, {
          fontSize: 8,
          bold: true
        })
        .down(25)
        // 案件名
        .text('件名：' + projectTitle, {
          fontSize: 10,
          bold: true
        })
        .down(10)
        .table(totalAmountMainLabel, {
          color: colorWhite,
          fontSize: 11,
          bold: true,
          fillColor: primaryColor,
          borderColor: primaryColor,
          margin: [5, 6, 5, 0]
        })
        .col(util.formatMoney(totalAmount, true, true), {
          width: 160,
          fontSize: 14,
          alignment: 'right',
          bold: true,
          fillColor: colorWhite,
          borderWidth: 2,
          borderColor: primaryColor,
          margin: [0, 4, 15, 4]
        })
        .down(30)
        // 金額明細
        .text(detailDescription, {
          bold: true
        })
        .down(3)
        .takeOverStyle(true)
        .table('品目', {
          color: colorWhite,
          bold: true,
          alignment: 'left',
          fillColor: primaryColor,
          border: false,
          ...listMarginFirstCol
        })
        .col('内容', {
          listMargin,
          width: '*'
        })
        .col('単価', {
          alignment: 'right'
        })
        .col('数量', {
          width: 40
        })
        .col('金額', {
          ...listMarginLastCol
        })

      each(data.items, (val, key) => {
        const fillColor = key % 2 === 0 ? secondaryColor : colorWhite
        factory
          .resetStyle()
          .row(val.name, {
            alignment: 'left',
            fillColor: fillColor,
            bold: true,
            ...listMarginFirstCol
          })
          .col(val.description)
          .col(util.formatMoney(val.unitPrice), {
            alignment: 'right'
          })
          .col(util.formatMoney(val.quantity))
          .col({
            text: util.formatMoney(val.amount),
            ...listMarginLastCol
          })
      })

      if (data.items.length < listMinRows) {
        let i = data.items.length
        for (i; i < listMinRows; i++) {
          const fillColor = i % 2 === 0 ? secondaryColor : colorWhite
          factory
            .row(' ', {
              fillColor: fillColor,
              ...listMargin
            })
            .col(' ')
            .col(' ')
            .col(' ')
            .col(' ')
        }
      }

      if (isShowTax) {
        // 消費税を表示する場合
        factory
          .setBorderFunc({
            hLineWidth (i, node) {
              const l = node.table.body.length
              if (i >= (l - 3)) {
                return 1
              }
              return 0
            },
            vLineWidth (i, node) {
              const l = node.table.widths.length
              if (i !== 0 && i === l) {
                return 1
              }
              return 0
            },
            hLineColor (i, node) {
              const l = node.table.body.length
              if (i >= (l - 3)) {
                return primaryColor
              }
              return colorWhite
            },
            vLineColor (i, node) {
              return colorWhite
            }
          })
          .takeOverStyle(false)
          // 小計
          .row('', {
            colSpan: 2,
            border: [false, true, false, false]
          })
          .col('')
          .col('小計', {
            colSpan: 2,
            alignment: 'center',
            border: [false, true, false, true],
            margin: [3, 1, 3, 0],
            ...totalStylePrimary
          })
          .col('')
          .col(util.formatMoney(subtotal), {
            alignment: 'right',
            ...totalStyleWhite,
            ...listMarginLastCol
          })
          // 消費税
          .row('', {
            colSpan: 2,
            border: false
          })
          .col('')
          .col('消費税', {
            colSpan: 2,
            alignment: 'center',
            margin: [3, 2, 3, 2],
            ...totalStyleWhite
          })
          .col('')
          .col(util.formatMoney(tax), {
            alignment: 'right',
            ...totalStyleWhite,
            ...listMarginLastCol
          })
      } else {
        // 消費税を表示しない場合
        factory
          .setBorderFunc({
            hLineWidth (i, node) {
              const l = node.table.body.length
              if (i >= (l - 1)) {
                return 1
              }
              return 0
            },
            vLineWidth (i, node) {
              const l = node.table.widths.length
              if (i !== 0 && i === l) {
                return 1
              }
              return 0
            },
            hLineColor (i, node) {
              const l = node.table.body.length
              if (i >= (l - 1)) {
                return primaryColor
              }
              return colorWhite
            },
            vLineColor (i, node) {
              return colorWhite
            }
          })
      }
      factory
        // 合計
        .takeOverStyle(false)
        .row('', {
          colSpan: 2,
          border: isShowTax ? false : [false, true, false, false]
        })
        .col('')
        .col('合計', {
          colSpan: 2,
          alignment: 'center',
          margin: [3, 1, 3, 0],
          ...totalStylePrimary
        })
        .col('')
        .col(util.formatMoney(totalAmount), {
          alignment: 'right',
          ...totalStyleWhite,
          ...listMarginLastCol
        })
        .down(30)
        // 備考
        .text('備考', {
          bold: true
        })
        .down(5)
        .text(note, {
          width: 240,
          border: false
        })

      const docDefinition = factory.shipment()
      docDefinition.footer = function (currentPage, pageCount) {
        return {
          text: `${currentPage.toString()} / ${pageCount}`,
          fontSize: 9,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        }
      }
      const fontDescriptors = {
        GenShinGothic: {
          normal: path.join(__dirname, '..', 'fonts/GenShinGothic/GenShinGothic-Normal.ttf'),
          bold: path.join(__dirname, '..', 'fonts/GenShinGothic/GenShinGothic-Bold.ttf')
        }
      }
      const printer = new PdfPrinter(fontDescriptors)
      const doc = printer.createPdfKitDocument(docDefinition)
      resolve(doc)
    } catch (err) {
      reject(err)
    }
  })
}

function createReport (data) {
  return download(data).then(createContent)
}
module.exports = createReport
