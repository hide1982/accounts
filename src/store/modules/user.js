import { getField, updateField } from 'vuex-map-fields'
import {
  SHOW_FORM,
  HIDE_FORM,
  SET,
  SET_FORM,
  SET_IMAGE,
  CANCEL_IMAGE,
  CLEAR_IMAGE,
  INIT_STATE,
  INIT_FORM,
  PROCESS_DATA,
  DATA_RECEIVED
} from '../mutation-types'
import { each, clone, isNull, isObject } from 'lodash'
import { createUser, uploadFileToS3, updateUser } from '../../api'
import { delay, toBase64 } from '../../util'
import { sub } from '../../Auth/AuthService'

const initUser = () => {
  return {
    name: '',
    company: '',
    zipcode: '',
    address1: '',
    address2: '',
    phone: '',
    imageUrl: ''
  }
}

const initForm = () => {
  return {
    id: null,
    name: '',
    company: '',
    zipcode: '',
    address1: '',
    address2: '',
    phone: '',
    imageUrl: '',
    imageData: null,
    imageFile: null
  }
}

const initState = () => {
  return {
    isProcessing: false,
    isShowForm: false,
    isCreatedUser: false,
    form: initForm(),
    user: initUser()
  }
}

export const namespaced = true

export const state = initState()

export const getters = {
  getField
}

export const mutations = {
  [SHOW_FORM] (state) {
    state.isShowForm = true
  },
  [HIDE_FORM] (state) {
    state.isShowForm = false
  },
  [SET] (state, payload) {
    state.id = payload._id
    state.user = payload.user
    state.isCreatedUser = true
  },
  [SET_FORM] (state) {
    const _form = clone(state.user)
    each(_form, (val, key) => {
      state.form[key] = val
    })
  },
  [INIT_STATE] (state) {
    const _state = initState()
    each(_state, (val, key) => {
      state[key] = val
    })
  },
  [INIT_FORM] (state) {
    state.form = initForm()
  },
  [PROCESS_DATA] (state) {
    state.isProcessing = true
  },
  [DATA_RECEIVED] (state) {
    state.isProcessing = false
  },
  [SET_IMAGE] (state, image) {
    state.form.imageFile = image.file
    state.form.imageData = image.data
  },
  [CANCEL_IMAGE] (state) {
    state.form.imageFile = null
    state.form.imageData = null
  },
  [CLEAR_IMAGE] (state) {
    state.form.imageFile = null
    state.form.imageData = null
    state.form.imageUrl = null
  },
  updateField
}

export const actions = {
  showForm ({ commit }) {
    commit(SHOW_FORM)
    commit(SET_FORM)
  },
  hideForm ({ commit }) {
    commit(HIDE_FORM)
  },
  setImage ({ commit }, file) {
    if (!isObject(file)) return
    const image = {
      file: file
    }
    toBase64(file)
      .then(res => {
        image.data = res
        commit(SET_IMAGE, image)
      })
  },
  cancelImage ({ commit }) {
    commit(CANCEL_IMAGE)
  },
  clearImage ({ commit }) {
    commit(CLEAR_IMAGE)
  },
  async create ({ rootState, commit }, data) {
    try {
      data.tax = rootState.tax
      data.lang = rootState.lang
      commit(PROCESS_DATA)
      const setDelayFunc = delay(1300)
      data.uid = sub()
      if (isNull(state.form.imageFile)) {
        const res = await createUser(data)
        setDelayFunc(() => {
          commit(SET, res.data)
          commit(INIT_FORM)
          commit(HIDE_FORM)
          commit(DATA_RECEIVED)
        })
      } else {
        const resS3 = await uploadFileToS3(state.form.imageFile)
        data.imageUrl = resS3.url
        const resUser = await createUser(data)
        setDelayFunc(() => {
          commit(SET, resUser.data)
          commit(INIT_FORM)
          commit(HIDE_FORM)
          commit(DATA_RECEIVED)
        })
      }
    } catch (err) {
      console.error(err)
      commit(DATA_RECEIVED)
    }
  },
  async update ({ rootState, state, commit }, data) {
    try {
      commit(PROCESS_DATA)
      const setDelayFunc = delay(1300)
      data.userId = rootState.user.id
      if (isNull(state.form.imageFile)) {
        const res = await updateUser(data)
        setDelayFunc(() => {
          commit(SET, res.data)
          commit(INIT_FORM)
          commit(HIDE_FORM)
          commit(DATA_RECEIVED)
        })
      } else {
        const resS3 = await uploadFileToS3(state.form.imageFile)
        data.imageUrl = resS3.url
        const resUser = await updateUser(data)
        setDelayFunc(() => {
          commit(SET, resUser.data)
          commit(INIT_FORM)
          commit(HIDE_FORM)
          commit(DATA_RECEIVED)
        })
      }
    } catch (err) {
      console.error(err)
      commit(DATA_RECEIVED)
    }
  }
}
