// src/Auth/AuthService.js

import Auth0 from 'auth0-js'
import config from './config.js'

const ACCESS_TOKEN = 'access_token'
const ID_TOKEN = 'id_token'
const EXPIRES_AT = 'expires_at'
const SUB = 'sub'

const auth0 = new Auth0.WebAuth(config)

export const login = () => {
  auth0.authorize()
}

export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN)
  localStorage.removeItem(ID_TOKEN)
  localStorage.removeItem(EXPIRES_AT)
  localStorage.removeItem(SUB)
}

export const handleAuthentication = () => {
  return new Promise((resolve, reject) => {
    auth0.parseHash((err, authResutl) => {
      if (err) {
        console.error(err)
        reject(err)
      } else if (authResutl && authResutl.accessToken && authResutl.idToken) {
        setSession(authResutl)
        resolve()
      }
    })
  })
}

export const isAuthenticated = () => {
  let expiresAt = JSON.parse(localStorage.getItem(EXPIRES_AT))
  return new Date().getTime() < expiresAt
}

export const sub = () => {
  return localStorage.getItem(SUB)
}

const setSession = (authResult) => {
  let expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  )
  localStorage.setItem(ACCESS_TOKEN, authResult.accessToken)
  localStorage.setItem(ID_TOKEN, authResult.idToken)
  localStorage.setItem(EXPIRES_AT, expiresAt)
  localStorage.setItem(SUB, authResult.idTokenPayload.sub.split('|')[1])
}
