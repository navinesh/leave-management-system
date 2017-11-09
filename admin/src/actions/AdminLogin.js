// @flow
export const LOGIN_ADMIN_REQUEST = 'LOGIN_ADMIN_REQUEST';
export const LOGIN_ADMIN_SUCCESS = 'LOGIN_ADMIN_SUCCESS';
export const LOGIN_ADMIN_FAILURE = 'LOGIN_ADMIN_FAILURE';

export const LOGIN_ADMIN_REQUEST_FROM_TOKEN = 'LOGIN_ADMIN_REQUEST_FROM_TOKEN';
export const LOGIN_ADMIN_SUCCESS_FROM_TOKEN = 'LOGIN_ADMIN_SUCCESS_FROM_TOKEN';
export const LOGIN_ADMIN_FAILURE_FROM_TOKEN = 'LOGIN_ADMIN_FAILURE_FROM_TOKEN';

export const requestAdminLogin = () => ({
  type: LOGIN_ADMIN_REQUEST
});

export const receiveAdminLogin = (data: Object) => ({
  type: LOGIN_ADMIN_SUCCESS,
  auth_info: data
});

export const loginAdminError = () => ({
  type: LOGIN_ADMIN_FAILURE
});

export const requestAdminLoginFromToken = () => ({
  type: LOGIN_ADMIN_REQUEST_FROM_TOKEN
});

export const receiveAdminLoginFromToken = (data: Object) => ({
  type: LOGIN_ADMIN_SUCCESS_FROM_TOKEN,
  auth_info: data
});

export const loginAdminErrorFromToken = (data: string) => ({
  type: LOGIN_ADMIN_FAILURE_FROM_TOKEN,
  message: data
});
