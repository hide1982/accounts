import { getField, updateField } from 'vuex-map-fields'
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
  DATA_RECEIVED,
  ADD_ITEM,
  DELETE_ITEM,
  CALCULATE_AMOUNT,
  CALCULATE_TOTAL_AMOUNT
} from '../mutation-types'
import { each, cloneDeep, isNaN, isNumber } from 'lodash'
import { createQuotation, updateQuotation, deleteQuotation, createQuotationReport } from '../../api'
import { save, delay } from '../../util'

const getAmount = (unitPrice, quantity) => {
  const _unitPrice = Number(unitPrice)
  const _quantity = Number(quantity)
  const amount = _unitPrice * _quantity
  if (!isNaN(amount)) {
    return amount
  }
  return 0
}

const initForm = () => {
  return {
    id: '',
    dateOfIssue: '',
    limit: '',
    projectTitle: '',
    client: '',
    items: [initItem()],
    totalAmount: null,
    note: ''
  }
}

const initItem = () => {
  return {
    name: '',
    description: '',
    unitPrice: null,
    quantity: null,
    amount: null
  }
}

const initState = () => {
  return {
    isProcessing: false,
    isShowForm: false,
    isShowDetailForm: false,
    selectedIndex: null,
    subtitle: '',
    form: initForm(),
    quotations: []
  }
}

export const namespaced = true

export const state = initState()

export const getters = {
  subtitle (state, getters, rootState) {
    if (state.isShowForm) {
      return rootState.labels.quotation.subtitles.create[rootState.lang]
    } else {
      return rootState.labels.quotation.subtitles.list[rootState.lang]
    }
  },
  formSubtotalAmount (state) {
    return state.form.totalAmount
  },
  formTaxAmount (state, getters, rootState) {
    return Math.floor(state.form.totalAmount * rootState.taxRate / 100)
  },
  formTotalAmount (state, getters, rootState) {
    let totalAmount = state.form.totalAmount
    if (rootState.tax) {
      totalAmount += getters.formTaxAmount
    }
    return totalAmount
  },
  subtotalAmount (state) {
    return isNumber(state.selectedIndex)
      ? state.quotations[state.selectedIndex].totalAmount
      : 0
  },
  taxAmount (state, getters, rootState) {
    return isNumber(state.selectedIndex)
      ? Math.floor(state.quotations[state.selectedIndex].totalAmount * rootState.taxRate / 100)
      : 0
  },
  totalAmount (state, getters, rootState) {
    if (!isNumber(state.selectedIndex)) return 0
    let totalAmount = state.quotations[state.selectedIndex].totalAmount
    if (rootState.tax) {
      totalAmount += getters.taxAmount
    }
    return totalAmount
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
  [ADD_ITEM] (state) {
    state.form.items.push(initItem())
  },
  [PROCESS_DATA] (state) {
    state.isProcessing = true
  },
  [DATA_RECEIVED] (state) {
    state.isProcessing = false
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
  [SET] (state, quotation) {
    state.quotations = quotation
  },
  [SET_FORM] (state, index) {
    state.form = cloneDeep(state.quotations[index])
  },
  [SHOW_DETAIL] (state, index) {
    state.selectedIndex = index
  },
  [HIDE_DETAIL] (state) {
    state.selectedIndex = null
  },
  [SHOW_DETAIL_FORM] (state) {
    state.isShowDetailForm = true
  },
  [HIDE_DETAIL_FORM] (state) {
    state.isShowDetailForm = false
  },
  [DELETE_ITEM] (state, index) {
    state.form.items.splice(index, 1)
  },
  [CALCULATE_AMOUNT] (state, index) {
    const amount = getAmount(
      state.form.items[index].unitPrice,
      state.form.items[index].quantity
    )
    state.form.items[index].amount = amount
  },
  [CALCULATE_TOTAL_AMOUNT] (state) {
    let totalAmount = 0
    each(state.form.items, item => {
      totalAmount += getAmount(item.unitPrice, item.quantity)
    })
    state.form.totalAmount = totalAmount
  },
  updateField
}

export const actions = {
  showForm ({ commit }) {
    commit(SHOW_FORM)
  },
  hideForm ({ commit }) {
    commit(HIDE_FORM)
    commit(INIT_FORM)
  },
  addItem ({ commit }) {
    commit(ADD_ITEM)
  },
  showDetail ({ commit }, index) {
    commit(SHOW_DETAIL, index)
  },
  hideDetail ({ commit }) {
    commit(HIDE_DETAIL)
    commit(INIT_FORM)
  },
  showDetailForm ({ commit, state }) {
    commit(SET_FORM, state.selectedIndex)
    commit(SHOW_DETAIL_FORM)
  },
  hideDetailForm ({ commit }) {
    commit(HIDE_DETAIL_FORM)
  },
  deleteItem ({ commit }, index) {
    commit(DELETE_ITEM, index)
  },
  calculateAmount ({ commit }, index) {
    commit(CALCULATE_AMOUNT, index)
  },
  calculateTotalAmount ({ commit }) {
    commit(CALCULATE_TOTAL_AMOUNT)
  },
  async create ({ rootState, state, commit }) {
    if (state.isProcessing) return
    commit(PROCESS_DATA)
    const setDelayFunc = delay(1300)
    const data = {
      userId: rootState.user.id,
      form: state.form
    }
    const res = await createQuotation(data).catch(err => {
      console.error(err)
      commit(DATA_RECEIVED)
    })
    setDelayFunc(() => {
      commit(INIT_FORM)
      commit(HIDE_FORM)
      commit(DATA_RECEIVED)
      commit(SET, res.data.quotation)
    })
  },
  async update ({ rootState, state, commit }) {
    if (state.isProcessing) return
    commit(PROCESS_DATA)
    const setDelayFunc = delay(1300)
    const data = {
      userId: rootState.user.id,
      form: state.form
    }
    const res = await updateQuotation(data).catch(err => {
      console.error(err)
      commit(DATA_RECEIVED)
    })
    setDelayFunc(() => {
      commit(HIDE_DETAIL_FORM)
      commit(DATA_RECEIVED)
      commit(SET, res.data.quotation)
    })
  },
  async remove ({ rootState, state, commit }) {
    if (state.isProcessing) return
    commit(PROCESS_DATA)
    const setDelayFunc = delay(1300)
    const data = {
      userId: rootState.user.id,
      _id: state.form._id
    }
    const res = await deleteQuotation(data).catch(err => {
      console.error(err)
      commit(DATA_RECEIVED)
    })
    setDelayFunc(() => {
      commit(HIDE_DETAIL_FORM)
      commit(HIDE_DETAIL)
      commit(INIT_FORM)
      commit(DATA_RECEIVED)
      commit(SET, res.data.quotation)
    })
  },
  async createReport ({ rootState, state, commit }) {
    if (state.isProcessing) return
    commit(PROCESS_DATA)
    const setDelayFunc = delay(1300)
    const quotation = state.quotations[state.selectedIndex]
    const data = {
      quotation: state.quotations[state.selectedIndex],
      client: rootState.client.clients[quotation.client],
      user: rootState.user.user,
      tax: rootState.tax
    }
    const res = await createQuotationReport(data).catch(err => {
      console.error(err)
      commit(DATA_RECEIVED)
    })
    setDelayFunc(() => {
      const date = new Date()
      const y = date.getFullYear()
      const m = ('0' + (date.getMonth() + 1)).slice(-2)
      const d = ('0' + date.getDate()).slice(-2)
      const h = date.getHours()
      const s = date.getSeconds()
      const filename = `quotation-${y}${m}${d}${h}${s}`
      const blob = new Blob([res.data], {type: res.headers['content-type']})
      save(blob, filename)
      commit(DATA_RECEIVED)
    })
  }
}
