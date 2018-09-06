// @flow
export const LOGIN_ADMIN_REQUEST = 'LOGIN_ADMIN_REQUEST';
export const LOGIN_ADMIN_SUCCESS = 'LOGIN_ADMIN_SUCCESS';
export const LOGIN_ADMIN_FAILURE = 'LOGIN_ADMIN_FAILURE';

export const LOGIN_ADMIN_REQUEST_FROM_TOKEN = 'LOGIN_ADMIN_REQUEST_FROM_TOKEN';
export const LOGIN_ADMIN_SUCCESS_FROM_TOKEN = 'LOGIN_ADMIN_SUCCESS_FROM_TOKEN';
export const LOGIN_ADMIN_FAILURE_FROM_TOKEN = 'LOGIN_ADMIN_FAILURE_FROM_TOKEN';

export function requestAdminLogin() {
  return { type: LOGIN_ADMIN_REQUEST };
}

export function receiveAdminLogin(data: Object) {
  return {
    type: LOGIN_ADMIN_SUCCESS,
    auth_info: data
  };
}

export function loginAdminError() {
  return {
    type: LOGIN_ADMIN_FAILURE
  };
}

export function requestAdminLoginFromToken() {
  return { type: LOGIN_ADMIN_REQUEST_FROM_TOKEN };
}

export function receiveAdminLoginFromToken(data: Object) {
  return {
    type: LOGIN_ADMIN_SUCCESS_FROM_TOKEN,
    auth_info: data
  };
}

export function loginAdminErrorFromToken(data: string) {
  return {
    type: LOGIN_ADMIN_FAILURE_FROM_TOKEN,
    message: data
  };
}
