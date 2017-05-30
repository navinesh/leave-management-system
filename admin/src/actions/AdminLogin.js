// @flow
import axios from 'axios';

export const LOGIN_ADMIN_REQUEST = 'LOGIN_ADMIN_REQUEST';
export const LOGIN_ADMIN_SUCCESS = 'LOGIN_ADMIN_SUCCESS';
export const LOGIN_ADMIN_FAILURE = 'LOGIN_ADMIN_FAILURE';

export const LOGIN_ADMIN_REQUEST_FROM_TOKEN = 'LOGIN_ADMIN_REQUEST_FROM_TOKEN';
export const LOGIN_ADMIN_SUCCESS_FROM_TOKEN = 'LOGIN_ADMIN_SUCCESS_FROM_TOKEN';
export const LOGIN_ADMIN_FAILURE_FROM_TOKEN = 'LOGIN_ADMIN_FAILURE_FROM_TOKEN';

export const requestAdminLogin = (creds: Object) => ({
  type: LOGIN_ADMIN_REQUEST,
  creds
});

export const receiveAdminLogin = (data: Object) => ({
  type: LOGIN_ADMIN_SUCCESS,
  auth_info: data
});

export const loginAdminError = (data: Object) => ({
  type: LOGIN_ADMIN_FAILURE,
  message: data.message
});

export const requestAdminLoginFromToken = (auth_token: string) => ({
  type: LOGIN_ADMIN_REQUEST_FROM_TOKEN,
  auth_token
});

export const receiveAdminLoginFromToken = (data: Object) => ({
  type: LOGIN_ADMIN_SUCCESS_FROM_TOKEN,
  auth_info: data
});

export const loginAdminErrorFromToken = (data: Object) => ({
  type: LOGIN_ADMIN_FAILURE_FROM_TOKEN,
  message: data.message
});

/*export const fetchLogin = (creds: Object) => {
  return (dispatch: Function) => {
    dispatch(requestAdminLogin(creds));
    axios
      .post('http://localhost:8080/adminlogin', {
        email: creds.email,
        password: creds.password
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(loginAdminError(response.data));
        } else {
          localStorage.setItem('admin_token', response.data.admin_token);
          dispatch(receiveAdminLogin(response.data));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
};*/

export const fetchLogin = (creds: Object) => {
  return async (dispatch: Function) => {
    try {
      dispatch(requestAdminLogin(creds));
      const response = await axios.post('http://localhost:8080/adminlogin', {
        email: creds.email,
        password: creds.password
      });
      if (response.status !== 201) {
        dispatch(loginAdminError(response.data));
      } else {
        localStorage.setItem('admin_token', response.data.admin_token);
        dispatch(receiveAdminLogin(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchLoginFromToken = (admin_token: string) => {
  return (dispatch: Function) => {
    dispatch(requestAdminLoginFromToken(admin_token));
    axios
      .post('http://localhost:8080/admintoken', {
        admin_token: admin_token
      })
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem('admin_token');
          dispatch(loginAdminErrorFromToken(response.data));
        } else {
          dispatch(receiveAdminLoginFromToken(response.data));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
};
