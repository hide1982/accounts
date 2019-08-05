import _PdfMakeContentFactory from './PdfMakeContentFactory'
export const PdfMakeContentFactory = _PdfMakeContentFactory

let isProccesingCascade = false
export const cascade = (interval = 0.1) => {
  if (isProccesingCascade) return
  isProccesingCascade = true
  setTimeout(() => {
    const items = document.querySelectorAll('.cascade-item:not(.cascade-item--shown)')
    if (items.length === 0) {
      isProccesingCascade = false
      return
    }
    const decrease = Math.floor(interval / 7 * 100) / 100
    let prevSeccond = interval
    let _decrease = decrease
    Object.keys(items).forEach((key) => {
      const seccond = key === '0' ? interval : Math.floor((prevSeccond + (interval - _decrease < 0 ? 0.03 : _decrease)) * 100) / 100
      items[key].setAttribute('style', 'transition-delay: ' + seccond + 's; margin-left: 0px;')
      items[key].classList.add('cascade-item--shown')
      prevSeccond = seccond
      _decrease = key === '0' ? _decrease : _decrease + decrease
    })
    isProccesingCascade = false
  }, 100)
}

export const delay = (time) => {
  let minTimePassed = false
  setTimeout(() => {
    minTimePassed = true
  }, time)
  return callback => {
    const refreshIntervalId = setInterval(() => {
      if (minTimePassed) {
        callback()
        clearInterval(refreshIntervalId)
      }
    }, 100)
  }
}

export const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.onerror = err => {
      reject(err)
    }
  })
}

export const save = (blob, fileName) => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  } else {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    )
    window.URL.revokeObjectURL(link.href)
    link.remove()
  }
}

export const makeid = (length) => {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export const formatMoney = (num) => {
  if (num) {
    return `¥${num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')}`
  }
  return '-'
}
