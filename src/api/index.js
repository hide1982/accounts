import axios from 'axios'
import { makeid } from '../util'

// common
export const fetch = uid => {
  return axios.get(`/api/get/${uid}`)
}

// user
export const createUser = data => {
  return axios.post('/api/user', data)
}

export const updateUser = data => {
  return axios.put('/api/user', data)
}

// client
export const createClient = data => {
  return axios.post('/api/client', data)
}

export const updateClient = data => {
  return axios.put('/api/client', data)
}

export const deleteClient = data => {
  return axios.delete('/api/client', { data: data })
}

// quotation
export const createQuotation = data => {
  return axios.post('/api/quotation', data)
}

export const updateQuotation = data => {
  return axios.put('/api/quotation', data)
}

export const deleteQuotation = data => {
  return axios.delete('/api/quotation', { data: data })
}

// invoice
export const createInvoice = data => {
  return axios.post('/api/invoice', data)
}

export const updateInvoice = data => {
  return axios.put('/api/invoice', data)
}

export const deleteInvoice = data => {
  return axios.delete('/api/invoice', { data: data })
}

// report
export const createQuotationReport = data => {
  return axios.post('/api/report/quotation', data, { responseType: 'arraybuffer' })
}

export const createInvoiceReport = data => {
  return axios.post('/api/report/invoice', data, { responseType: 'arraybuffer' })
}

// etc
export const downloadPdf = data => {
  return axios.post('/api/pdf', data, { responseType: 'arraybuffer' })
}

// aws s3
export const uploadFileToS3 = (file) => {
  const fileName = makeid(32)
  const url = `/sign-s3?file-name=${fileName}.${file.name}&file-type=${file.type}`
  return axios.get(url)
    .then(res => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', res.data.signedRequest)
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(res.data)
            } else {
              reject(xhr)
            }
          }
        }
        xhr.send(file)
      })
    })
}

// setting
export const saveSettings = (data) => {
  return axios.put('/api/setting', data)
}
