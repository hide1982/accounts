import { DOWNLOAD_PDF, DOWNLOAD_PDF_SUCCESS, DOWNLOAD_PDF_FAIL } from '../mutation-types'
import { downloadPdf } from '../../api'
import { save } from '../../util'

export const namespaced = true

export const state = {
  downloading: false
}

export const mutations = {
  [DOWNLOAD_PDF] (state) {
    state.downloading = true
  },
  [DOWNLOAD_PDF_SUCCESS] (state) {
    state.downloading = false
  },
  [DOWNLOAD_PDF_FAIL] (state) {
    state.downloading = false
  }
}

export const actions = {
  downloadPdf ({commit}) {
    commit(DOWNLOAD_PDF)
    downloadPdf()
      .then(res => {
        const blob = new Blob([res.data], {type: res.headers['content-type']})
        save(blob)
        // const link = document.createElement('a')
        // link.href = window.URL.createObjectURL(blob)
        // link.download = 'test.pdf'
        // link.click()
        commit(DOWNLOAD_PDF_SUCCESS, res)
      })
      .catch(err => {
        console.error(err)
        commit(DOWNLOAD_PDF_FAIL, err)
      })
  }
}
