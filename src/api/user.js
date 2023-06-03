/*
 ** 登录注册api
 */

import request from '@/utils/request'

/*
 ** 用户和密码登录
 */
export const accountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/*
 ** 获取验证码
 */
export const mobileLoginCodeMsg = ({ mobile }) => {
  return request('/login/code', 'get', { mobile })
}

/*
 ** 手机号验证码登录
 */
export const mobileLoginCode = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/*
 ** 注册账号
 */
export const userRegister = ({ account, password, mobile, code }) => {
  return request('/register', 'post', { account, password, mobile, code })
}

export const userRegisterCheck = (accuont) => {
  return request('/register/check', 'get')
}
