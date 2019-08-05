// todo.js
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const accounts = new mongoose.Schema({
  uid: String,
  user: {
    name: String,
    company: String,
    phone: String,
    address1: String,
    address2: String,
    zipcode: String,
    imageUrl: String,
    created: Date,
    updated: Date
  },
  client: [{
    name: String,
    company: String,
    phone: String,
    address1: String,
    address2: String,
    zipcode: String,
    created: Date,
    updated: Date
  }],
  quotation: [{
    dateOfIssue: Date,
    projectTitle: String,
    client: String,
    limit: Date,
    items: [{
      name: String,
      description: String,
      unitPrice: Number,
      quantity: Number,
      amount: Number
    }],
    totalAmount: Number,
    note: String
  }],
  invoice: [{
    dateOfIssue: Date,
    projectTitle: String,
    client: String,
    limit: Date,
    items: [{
      name: String,
      description: String,
      unitPrice: Number,
      quantity: Number,
      amount: Number
    }],
    totalAmount: Number,
    note: String
  }],
  setting: {
    lang: Number,
    tax: Number
  }
})

module.exports = mongoose.model('accounts2', accounts)
