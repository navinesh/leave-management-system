// @flow
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const LOGIN_USER_REQUEST_FROM_TOKEN = 'LOGIN_USER_REQUEST_FROM_TOKEN';
export const LOGIN_USER_SUCCESS_FROM_TOKEN = 'LOGIN_USER_SUCCESS_FROM_TOKEN';
export const LOGIN_USER_FAILURE_FROM_TOKEN = 'LOGIN_USER_FAILURE_FROM_TOKEN';

export function requestUserLogin() {
  return { type: LOGIN_USER_REQUEST };
}

export function receiveUserLogin(data: Object) {
  return {
    type: LOGIN_USER_SUCCESS,
    auth_info: data
  };
}

export function loginUserError() {
  return { type: LOGIN_USER_FAILURE };
}

export function requestUserLoginFromToken() {
  return { type: LOGIN_USER_REQUEST_FROM_TOKEN };
}

export function receiveUserLoginFromToken(data: Object) {
  return {
    type: LOGIN_USER_SUCCESS_FROM_TOKEN,
    auth_info: data
  };
}

export function loginUserErrorFromToken(data: string) {
  return {
    type: LOGIN_USER_FAILURE_FROM_TOKEN,
    message: data
  };
}
