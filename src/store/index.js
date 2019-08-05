import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'
import router from '../router'
import {
  LOGIN, LOGOUT, CHANGE_LANG, SET, INIT_STATE, SEND_MESSAGE,
  DELETE_MESSAGE, CLEAR_MESSAGES, SETTING_TAX, PROCESS_DATA, DATA_RECEIVED,
  SET_SETTING
} from './mutation-types'
import { fetch, saveSettings } from '../api'
import * as user from './modules/user'
import * as client from './modules/client'
import * as quotation from './modules/quotation'
import * as invoice from './modules/invoice'
import * as etc from './modules/etc'
import { logout, isAuthenticated, sub } from '../Auth/AuthService'
import labels from './label'
import { delay } from './../util'

Vue.use(Vuex)

const initState = () => {
  return {
    uid: sub(),
    lang: 0, // { 0: ja, 1: en }
    tax: 0,
    taxRate: 8,
    isLoggedin: isAuthenticated(),
    isProcessing: false,
    labels: labels,
    messages: []
  }
}

export default new Vuex.Store({
  state: initState(),
  getters: {
    getField
  },
  mutations: {
    [LOGIN] (state) {
      state.uid = sub()
      state.isLoggedin = true
    },
    [LOGOUT] (state) {
      state.isLoggedin = false
    },
    [CHANGE_LANG] (state, lang) {
      state.lang = Number(lang)
    },
    [SEND_MESSAGE] (state, message) {
      state.messages.push(message)
    },
    [DELETE_MESSAGE] (state, index) {
      state.messages.splice(index, 1)
    },
    [CLEAR_MESSAGES] (state) {
      state.messages = []
    },
    [SETTING_TAX] (state, tax) {
      state.tax = Number(tax)
    },
    [PROCESS_DATA] (state) {
      state.isProcessing = true
    },
    [DATA_RECEIVED] (state) {
      state.isProcessing = false
    },
    [SET_SETTING] (state, setting) {
      state.lang = setting.lang
      state.tax = setting.tax
    },
    updateField
  },
  actions: {
    login ({ commit }) {
      commit(LOGIN)
    },
    logout ({ commit }) {
      logout()
      commit(LOGOUT)
      commit(`user/${INIT_STATE}`)
      commit(`client/${INIT_STATE}`)
      commit(`quotation/${INIT_STATE}`)
      commit(`invoice/${INIT_STATE}`)
      router.replace('/login')
    },
    async get ({ commit, state }) {
      const res = await fetch(state.uid).catch(err => {
        console.error(err)
      })
      if (res.data.length) {
        const data = res.data[0]
        commit(SET_SETTING, data.setting)
        commit(`user/${SET}`, data)
        commit(`client/${SET}`, data.client)
        commit(`quotation/${SET}`, data.quotation)
        commit(`invoice/${SET}`, data.invoice)
      }
    },
    changeLang ({ commit }, e) {
      commit(CHANGE_LANG, e.target.value)
    },
    sendMessage ({ commit }, message) {
      commit(SEND_MESSAGE, message)
    },
    deleteMessage ({ commit }, index) {
      commit(DELETE_MESSAGE, index)
    },
    clearMessages ({ commit }) {
      commit(CLEAR_MESSAGES)
    },
    setTax ({ commit }, e) {
      commit(SETTING_TAX, e.target.value)
    },
    async saveSetting ({ state, commit }) {
      commit(PROCESS_DATA)
      const data = {
        userId: state.user.id,
        tax: state.tax,
        lang: state.lang
      }
      const setDelayFunc = delay(1300)
      const res = await saveSettings(data).catch(err => {
        console.error(err)
        commit(DATA_RECEIVED)
      })
      setDelayFunc(() => {
        commit(SET_SETTING, res.data.setting)
        commit(DATA_RECEIVED)
      })
    }
  },
  modules: {
    user,
    client,
    quotation,
    invoice,
    etc
  }
})
