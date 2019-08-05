import { getField, updateField } from 'vuex-map-fields'
import { each, clone } from 'lodash'
import {
  INIT_STATE,
  INIT_FORM,
  SET,
  SET_FORM,
  SHOW_FORM,
  HIDE_FORM,
  SHOW_DETAIL,
  HIDE_DETAIL,
  SHOW_DETAIL_FORM,
  HIDE_DETAIL_FORM,
  PROCESS_DATA,
  DATA_RECEIVED
} from '../mutation-types'
import { createClient, updateClient, deleteClient } from '../../api'
import { delay } from '../../util'

const formList = ['_id', 'name', 'company', 'zipcode', 'address1', 'address2', 'phone']
const initForm = () => {
  const _form = {}
  each(formList, val => {
    _form[val] = null
  })
  return _form
}

const initState = () => {
  return {
    isProcessing: false,
    isShowForm: false,
    isShowDetaiForm: false,
    selectedClientIndex: null,
    form: initForm(),
    clients: []
  }
}

export const namespaced = true

export const state = initState()

export const getters = {
  getClient (state, index) {
    return index => state.clients[index]
  },
  getField
}

export const mutations = {
  [SHOW_FORM] (state) {
    state.isShowForm = true
  },
  [HIDE_FORM] (state) {
    state.isShowForm = false
  },
  [SET] (state, client) {
    state.clients = client
  },
  [SET_FORM] (state) {
    state.form = clone(state.clients[state.selectedClientIndex])
  },
  [SHOW_DETAIL] (state, index) {
    state.selectedClientIndex = index
  },
  [HIDE_DETAIL] (state) {
    state.selectedClientIndex = null
    state.isShowDetaiForm = false
    state.form = initForm()
  },
  [SHOW_DETAIL_FORM] (state) {
    state.isShowDetaiForm = true
  },
  [HIDE_DETAIL_FORM] (state) {
    state.isShowDetaiForm = false
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
  updateField
}

export const actions = {
  showForm ({ commit }) {
    commit(SHOW_FORM)
  },
  hideForm ({ commit }) {
    commit(HIDE_FORM)
  },
  showDetail ({ commit }, clientIndex) {
    commit(SHOW_DETAIL, clientIndex)
  },
  hideDetail ({ commit }) {
    commit(HIDE_DETAIL)
  },
  showDetailForm ({ commit }) {
    commit(SET_FORM)
    commit(SHOW_DETAIL_FORM)
  },
  hideDetailForm ({ commit }) {
    commit(HIDE_DETAIL_FORM)
  },
  async create ({ rootState, state, commit }) {
    commit(PROCESS_DATA)
    const setDelayFunc = delay(1300)
    const data = {
      userId: rootState.user.id,
      form: state.form
    }
    const res = await createClient(data).catch(err => {
      console.error(err)
      commit(DATA_RECEIVED)
    })
    setDelayFunc(() => {
      commit(SET, res.data.client)
      commit(INIT_FORM)
      commit(HIDE_FORM)
      commit(DATA_RECEIVED)
    })
  },
  async update ({ rootState, state, commit }) {
    commit(PROCESS_DATA)
    const setDelayFunc = delay(1300)
    const data = {
      userId: rootState.user.id,
      ...state.form
    }
    const res = await updateClient(data).catch(err => {
      console.error(err)
      commit(DATA_RECEIVED)
    })
    setDelayFunc(() => {
      commit(SET, res.data.client)
      commit(HIDE_DETAIL_FORM)
      commit(DATA_RECEIVED)
    })
  },
  async remove ({ rootState, state, commit }) {
    commit(PROCESS_DATA)
    const setDelayFunc = delay(1300)
    const data = {
      userId: rootState.user.id,
      _id: state.form._id
    }
    const res = await deleteClient(data).catch(err => {
      console.error(err)
      commit(DATA_RECEIVED)
    })
    setDelayFunc(() => {
      commit(SET, res.data.client)
      commit(HIDE_DETAIL_FORM)
      commit(HIDE_DETAIL)
      commit(INIT_FORM)
      commit(DATA_RECEIVED)
    })
  }
}
