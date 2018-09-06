// @flow
import axios from 'axios';

export const REQUEST_PASSWORD_CHANGE = 'REQUEST_PASSWORD_CHANGE';
export const PASSWORD_CHANGE_SUCCESS = 'PASSWORD_CHANGE_SUCCESS';
export const PASSWORD_CHANGE_ERROR = 'PASSWORD_CHANGE_ERROR';
export const CLEAR_CHANGE_PASSWORD_ERROR = 'CLEAR_CHANGE_PASSWORD_ERROR';

export const requestPasswordChange = (creds: Object) => {
  return { type: REQUEST_PASSWORD_CHANGE, creds };
};

export const passwordChangeError = (data: Object) => {
  return { type: PASSWORD_CHANGE_ERROR, message: data.message };
};

export const passwordChangeSuccess = (data: Object) => {
  return { type: PASSWORD_CHANGE_SUCCESS, message: data.message };
};

export const clearChangePasswordError = () => {
  return { type: CLEAR_CHANGE_PASSWORD_ERROR };
};

export const changePassword = (creds: Object) => async (dispatch: Function) => {
  try {
    dispatch(requestPasswordChange(creds));
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/change-password',
      auth: { username: creds.auth_token },
      data: {
        oldPassword: creds.currentPassword,
        newPassword: creds.newPassword
      }
    });

    if (response.status !== 201) {
      dispatch(passwordChangeError(response.data));
    } else {
      dispatch(passwordChangeSuccess(response.data));
    }
  } catch (error) {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'LOGIN_FAILURE_FROM_TOKEN' });
  }
};
