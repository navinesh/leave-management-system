// @flow
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const LOGIN_USER_REQUEST_FROM_TOKEN = 'LOGIN_USER_REQUEST_FROM_TOKEN';
export const LOGIN_USER_SUCCESS_FROM_TOKEN = 'LOGIN_USER_SUCCESS_FROM_TOKEN';
export const LOGIN_USER_FAILURE_FROM_TOKEN = 'LOGIN_USER_FAILURE_FROM_TOKEN';
export const LOGIN_FAILURE_FROM_TOKEN = 'LOGIN_FAILURE_FROM_TOKEN';

export const requestUserLogin = () => ({
  type: LOGIN_USER_REQUEST
});

export const receiveUserLogin = (data: Object) => ({
  type: LOGIN_USER_SUCCESS,
  auth_info: data
});

export const loginUserError = () => ({
  type: LOGIN_USER_FAILURE
});

export const requestUserLoginFromToken = () => ({
  type: LOGIN_USER_REQUEST_FROM_TOKEN
});

export const receiveUserLoginFromToken = (data: Object) => ({
  type: LOGIN_USER_SUCCESS_FROM_TOKEN,
  auth_info: data
});

export const loginUserErrorFromToken = (data: string) => ({
  type: LOGIN_USER_FAILURE_FROM_TOKEN,
  message: data
});
