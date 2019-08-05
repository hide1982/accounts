const Accounts = require('../db/mongoSchema')
const router = require('express').Router()
const reportQuotation = require('../report/quotation')
const reportInvoice = require('../report/invoice')

const handleResponse = (res, err, results, id = null) => {
  if (err) {
    res.status(500).send()
  } else if (id === null) {
    res.status(200).send(results)
  } else {
    Accounts.findOne({ _id: id }, (err, results) => {
      if (err) {
        res.status(500).send()
      } else {
        res.status(200).send(results)
      }
    })
  }
}

// GET
router.get('/get/:uid', (req, res) => {
  const uid = req.params.uid
  Accounts.find({uid: uid}, (err, resArray) => {
    if (err) {
      res.status(500).send()
    } else {
      res.status(200).send(resArray)
    }
  }).sort({limitDate: 1})
})

// POST
router.post('/user', (req, res) => {
  const { name, company, phone, address1, address2, zipcode, uid, imageUrl, tax, lang } = req.body
  new Accounts({
    uid: uid,
    user: {
      name,
      company,
      phone,
      address1,
      address2,
      zipcode,
      imageUrl,
      created: Date.now(),
      updated: null
    },
    setting: {
      tax,
      lang
    }
  }).save((err, results) => {
    handleResponse(res, err, results)
  })
})

router.post('/client', (req, res) => {
  const userId = req.body.userId
  const { name, company, phone, address1, address2, zipcode } = req.body.form
  Accounts.findByIdAndUpdate(userId,
    { $push: {
      client: {
        name,
        company,
        phone,
        address1,
        address2,
        zipcode,
        created: Date.now(),
        updated: null
      }
    }},
    (err, results) => {
      handleResponse(res, err, results, userId)
    }
  )
})

router.post('/quotation', (req, res) => {
  const userId = req.body.userId
  const { dateOfIssue, limit, projectTitle, client, items, totalAmount, note } = req.body.form
  Accounts.findByIdAndUpdate(userId,
    { $push: {
      quotation: {
        dateOfIssue,
        limit,
        projectTitle,
        client,
        items,
        totalAmount,
        note,
        created: Date.now(),
        updated: null
      }
    }},
    (err, results) => {
      handleResponse(res, err, results, userId)
    }
  )
})

router.post('/invoice', (req, res) => {
  const userId = req.body.userId
  const { dateOfIssue, limit, projectTitle, client, items, totalAmount, note } = req.body.form
  Accounts.findByIdAndUpdate(userId,
    { $push: {
      invoice: {
        dateOfIssue,
        limit,
        projectTitle,
        client,
        items,
        totalAmount,
        note,
        created: Date.now(),
        updated: null
      }
    }},
    (err, results) => {
      handleResponse(res, err, results, userId)
    }
  )
})

// PUT
router.put('/user', (req, res) => {
  const { userId, name, company, phone, address1, address2, zipcode, imageUrl } = req.body
  Accounts.findByIdAndUpdate(userId, {
    user: {
      name,
      company,
      phone,
      address1,
      address2,
      zipcode,
      imageUrl,
      updated: Date.now()
    }
  }, (err, results) => {
    handleResponse(res, err, results, userId)
  })
})

router.put('/client', (req, res) => {
  const { userId, _id, name, company, phone, address1, address2, zipcode } = req.body
  Accounts.update(
    { 'client._id': _id },
    { 'client.$':
      {
        name,
        company,
        phone,
        address1,
        address2,
        zipcode,
        updated: Date.now()
      }
    }, (err, results) => {
      handleResponse(res, err, results, userId)
    })
})

router.put('/quotation', (req, res) => {
  const userId = req.body.userId
  const { _id, dateOfIssue, limit, projectTitle, client, items, totalAmount, note } = req.body.form
  Accounts.update(
    { 'quotation._id': _id },
    { 'quotation.$':
      {
        dateOfIssue,
        limit,
        client,
        projectTitle,
        items,
        totalAmount,
        note,
        updated: Date.now()
      }
    }, (err, results) => {
      handleResponse(res, err, results, userId)
    })
})

router.put('/invoice', (req, res) => {
  const userId = req.body.userId
  const { _id, dateOfIssue, limit, projectTitle, client, items, totalAmount, note } = req.body.form
  Accounts.update(
    { 'invoice._id': _id },
    { 'invoice.$':
      {
        dateOfIssue,
        limit,
        client,
        projectTitle,
        items,
        totalAmount,
        note,
        updated: Date.now()
      }
    }, (err, results) => {
      handleResponse(res, err, results, userId)
    })
})

router.put('/setting', (req, res) => {
  const { userId, lang, tax } = req.body
  Accounts.findByIdAndUpdate(userId, {
    setting: {
      lang,
      tax,
      updated: Date.now()
    }
  }, (err, results) => {
    handleResponse(res, err, results, userId)
  })
})

// DELETE
router.delete('/client', (req, res) => {
  const { userId, _id } = req.body
  Accounts.update({ _id: userId }, { '$pull': { 'client': { _id: _id } } },
    (err, results) => {
      handleResponse(res, err, results, userId)
    })
})

router.delete('/quotation', (req, res) => {
  const { userId, _id } = req.body
  Accounts.update({ _id: userId }, { '$pull': { 'quotation': { _id: _id } } },
    (err, results) => {
      handleResponse(res, err, results, userId)
    })
})

router.delete('/invoice', (req, res) => {
  const { userId, _id } = req.body
  Accounts.update({ _id: userId }, { '$pull': { 'invoice': { _id: _id } } },
    (err, results) => {
      handleResponse(res, err, results, userId)
    })
})

// report
router.post('/report/quotation', (req, res) => {
  reportQuotation(req, res)
})

router.post('/report/invoice', (req, res) => {
  reportInvoice(req, res)
})

module.exports = router
