const path = require('path')
const fs = require('fs')
const createReport = require('./report-template')
const config = require('../config')

module.exports = (req, res) => {
  const client = req.body.client
  const user = req.body.user
  const quotation = req.body.quotation
  const isShowTax = req.body.tax

  createReport({
    title: '見積書',
    clientName: client.company,
    dateOfIssue: quotation.dateOfIssue,
    zipcode: user.zipcode,
    address1: user.address1,
    address2: user.address2,
    userName: user.company,
    phone: user.phone,
    imageUrl: user.imageUrl,
    description: '下記の通りお見積申し上げます',
    totalAmountMainLabel: 'お見積金額',
    detailDescription: '見積明細',
    projectTitle: quotation.projectTitle,
    subtotal: quotation.totalAmount,
    tax: quotation.totalAmount,
    items: quotation.items,
    totalAmount: quotation.totalAmount,
    note: quotation.note,
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
