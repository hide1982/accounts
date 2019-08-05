const path = require('path')
const fs = require('fs')
const createReport = require('./report-template')
const config = require('../config')

module.exports = (req, res) => {
  const client = req.body.client
  const user = req.body.user
  const invoice = req.body.invoice
  const isShowTax = req.body.tax

  createReport({
    title: '請求書',
    clientName: client.company,
    dateOfIssue: invoice.dateOfIssue,
    zipcode: user.zipcode,
    address1: user.address1,
    address2: user.address2,
    userName: user.company,
    phone: user.phone,
    imageUrl: user.imageUrl,
    description: '下記の通りご請求申し上げます',
    totalAmountMainLabel: 'ご請求金額',
    detailDescription: '請求明細',
    projectTitle: invoice.projectTitle,
    subtotal: invoice.totalAmount,
    tax: invoice.totalAmount,
    items: invoice.items,
    totalAmount: invoice.totalAmount,
    note: invoice.note,
    isShowTax: isShowTax
  }).then(doc => {
    const filename = path.resolve(config.tmpPath, 'tmp.pdf')
    doc.pipe(fs.createWriteStream(filename))
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-type', 'application/pdf')
    doc.pipe(res)
    doc.end()
  }).catch(err => {
    console.log(err)
  })
}
