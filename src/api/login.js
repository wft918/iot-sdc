import request from '@/router/axios'
import qs from 'qs'

const scope = 'server'

export const loginByUsername = (username, password, code, randomStr) => {
  let grant_type = 'password'
  let dataObj = qs.stringify({'username': username, 'password': password})

  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'TENANT-ID': '1',
      'Authorization': 'Basic cGxhbnBsYXQ6cGxhbnBsYXQ='
    },
    method: 'post',
    params: {randomStr, code, grant_type},
    data: dataObj
  })
}

export const refreshToken = (refresh_token) => {
  const grant_type = 'refresh_token'
  return request({
    url: '/auth/oauth/token',
    headers: {
      'isToken': false,
      'TENANT-ID': '1',
      'Authorization': 'Basic cGxhbnBsYXQ6cGxhbnBsYXQ='
    },
    method: 'post',
    params: {refresh_token, grant_type, scope}
  })
}

export const loginByMobile = (mobile, code) => {
  const grant_type = 'mobile'
  return request({
    url: '/auth/mobile/token/sms',
    headers: {
      'TENANT-ID': '1',
      'Authorization': 'Basic cGxhbnBsYXQ6cGxhbnBsYXQ='
    },
    method: 'post',
    params: {mobile: 'SMS@' + mobile, code: code, grant_type}
  })
}

export const loginBySocial = (state, code) => {
  const grant_type = 'mobile'
  return request({
    url: '/auth/mobile/token/social',
    headers: {
      'TENANT-ID': '1',
      'Authorization': 'Basic cGxhbnBsYXQ6cGxhbnBsYXQ='
    },
    method: 'post',
    params: {mobile: state + '@' + code, grant_type}
  })
}

export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

export const logout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}
