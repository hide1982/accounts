const PDFDocument = require('pdfkit')
const express = require('express')
const router = express.Router()
const path = require('path')

const a4x = 595.28
const a4y = 841.89
const xStart = 55
const yStart = 43
const xEnd = a4x - xStart
const yEnd = a4y - yStart

const primaryColor = '#98A9D4'
const secondaryColor = '#DADFF0'

const getDate = (date) => {
  const _date = new Date(date)
  const y = _date.getFullYear()
  const m = _date.getMonth() + 1
  const d = _date.getDate()
  const h = _date.getHours()
  const s = _date.getSeconds()
  return {
    y,
    m,
    d,
    h,
    s
  }
}

const drawGrid = (doc) => {
  const _drawGrid = (interval, color) => {
    let yPos = interval
    while (yPos < a4y) {
      doc.moveTo(0, yPos)
        .strokeColor(color)
        .lineTo(a4x, yPos)
        .stroke()
      yPos = yPos + interval
    }
    let xPos = interval
    while (xPos < a4x) {
      doc.moveTo(xPos, 0)
        .strokeColor(color)
        .lineTo(xPos, a4y)
        .stroke()
      xPos = xPos + interval
    }
  }
  _drawGrid(10, '#eee')
  _drawGrid(50, '#ddd')
  _drawGrid(100, '#bbb')
}

const box = (doc, { x, y, width, height, borderWidth, borderColor, fillColor }) => {
  const _y = y + height / 2
  const _borderWidth = borderWidth === undefined ? 0 : borderWidth
  const fillHeight = height - _borderWidth * 2
  doc.lineWidth(height)
  doc.fillAndStroke(borderColor, borderColor)
  doc.moveTo(x, _y)
  doc.lineTo(x + width, _y)
  doc.stroke()

  doc.lineWidth(fillHeight)
  doc.fillAndStroke(fillColor, fillColor)
  doc.moveTo(x + _borderWidth, _y)
  doc.lineTo(x + width - _borderWidth, _y)
  doc.stroke()
}

const stripe = (doc, { x, y, width, height, oddColor, evenColor, number }) => {
  for (var i = 0; i < number; i++) {
    const color = i % 2 === 0 ? oddColor : evenColor
    box(doc, {
      x: x,
      y: y + height * i,
      width: width,
      height: height,
      fillColor: color
    })
  }
}

const Gap = (start, gap) => {
  const _start = start
  let count = 0
  return (add) => {
    if (add) {
      count += add
    } else {
      count++
    }
    return _start + count * gap
  }
}

const create = (doc, data) => {
  const { user, client, quotation } = data
  // 取引先名
  doc
    .fillColor('#000')
    .fontSize(12)
    .text(`${client.company}  御中`, xStart, 150)

  // 発行日
  const { y, m, d } = getDate(quotation.dateOfIssue)

  doc.fontSize(8).lineGap(15)
  const gap = Gap(120, 14)

  doc.text(`発行日 : ${y}年${m}月${d}日`, 400, gap())

  doc.text(user.zipcode, 400, gap())

  doc.text(`発行日 : ${y}年${m}月${d}日`, 400, gap())
}

router.post('/', (req, res) => {
  try {
    const doc = new PDFDocument({
      size: 'A4'
      // margin: 50
    })

    doc.font(path.resolve(__dirname, '..', 'fonts/GenShinGothic/GenShinGothic-Bold.ttf'))
    // doc.image(path.resolve(__dirname, '..', 'assets/quotation-best.jpeg'), 0, 0, {fit: [a4x, a4y]})
    drawGrid(doc)

    box(doc, {
      x: xStart,
      y: yStart,
      width: xEnd - xStart,
      height: 12,
      fillColor: primaryColor
    })

    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .text('見積書', 275, 64)

    doc
      .fillColor('#222')
      .fontSize(7)
      .text('下記の通り見積もり申し上げます', xStart + 2, 240)

    // 見積金額
    box(doc, {
      x: xStart,
      y: 275,
      width: 67,
      height: 35,
      borderWidth: 2,
      borderColor: primaryColor
    })
    box(doc, {
      x: xStart + 64,
      y: 275,
      width: 182,
      height: 35,
      borderWidth: 2,
      borderColor: primaryColor,
      fillColor: '#fff'
    })
    doc
      .fillColor('#fff')
      .fontSize(10)
      .text('お見積金額', xStart + 7, 285)

    // 見積明細
    doc
      .fontSize(8)
      .fillColor('#222')
      .text('見積明細', xStart + 3, 340)
    box(doc, {
      x: xStart,
      y: 352,
      width: xEnd - xStart,
      height: 12,
      fillColor: primaryColor
    })
    stripe(doc, {
      x: xStart,
      y: 364,
      width: xEnd - xStart,
      height: 12,
      oddColor: secondaryColor,
      evenColor: '#fff',
      number: 16
    })
    box(doc, {
      x: 383,
      y: 556,
      width: 90,
      height: 14,
      fillColor: primaryColor
    })
    // 合計
    doc.moveTo(xStart, 556)
      .lineWidth(1)
      .lineTo(xEnd, 556)
      .stroke()
    doc.moveTo(473, 569.5)
      .lineTo(xEnd, 569.5)
      .stroke()

    // 明細縦線
    doc.moveTo(168, 364)
      .dash(1, { space: 1 })
      .lineTo(168, 556)
      .stroke()
    doc.moveTo(383.5, 364)
      .dash(1, { space: 0 })
      .lineTo(383.5, 556)
      .stroke()
    doc.moveTo(443, 364)
      .lineTo(443, 556)
      .stroke()
    doc.moveTo(472.5, 364)
      .lineTo(472.5, 556)
      .stroke()

    const headerTextY = 353
    doc
      .fontSize(7)
      .fillColor('#fff')
      .text('品目', xStart + 4, headerTextY)
    doc.text('内容', 173, headerTextY)
    doc.text('単価', 387, headerTextY)
    doc.text('数量', 447, headerTextY)
    doc.text('金額', 477, headerTextY)
    doc.text('合計', 418, 557)

    // データを書き込み
    create(doc, req.body)

    res.setHeader('Content-disposition', 'attachment; filename="' + 'quotation.company.month.day.pdf' + '"')
    res.setHeader('Content-type', 'application/pdf')
    doc.pipe(res)
    doc.end()
  } catch (err) {
    console.error('MakePDF ERROR: ' + err.message)
  }
})

module.exports = router
