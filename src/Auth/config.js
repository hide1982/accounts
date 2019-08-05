const protocol = location.protocol
const host = location.host

export default {
  domain: 'penguin84.auth0.com',
  clientID: 'kEQrqRTinZsLl87JQvKotwOGasitGalp',
  redirectUri: `${protocol}//${host}/auth`,
  audience: 'https://penguin84.auth0.com/userinfo',
  responseType: 'token id_token',
  scope: 'openid'
}
