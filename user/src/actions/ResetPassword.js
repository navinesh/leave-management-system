// @flow
import axios from 'axios';

export const REQUEST_PASSWORD_RESET = 'REQUEST_PASSWORD_RESET';
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
export const PASSWORD_RESET_ERROR = 'PASSWORD_RESET_ERROR';
export const CLEAR_RESET_PASSWORD_MESSAGE = 'CLEAR_RESET_PASSWORD_MESSAGE';

export const requestPasswordReset = (email: string) => {
  return { type: REQUEST_PASSWORD_RESET, email };
};

export const passwordResetError = (data: Object) => {
  return { type: PASSWORD_RESET_ERROR, message: data.message };
};

export const passwordResetSuccess = (data: Object) => {
  return { type: PASSWORD_RESET_SUCCESS, message: data.message };
};

export const clearResetPasswordMessage = () => {
  return { type: CLEAR_RESET_PASSWORD_MESSAGE };
};

export const resetPassword = (email: string) => async (dispatch: Function) => {
  try {
    dispatch(requestPasswordReset(email));
    const response = await axios.post(
      'http://localhost:8080/user-reset-password',
      { email: email }
    );

    if (response.status !== 201) {
      dispatch(passwordResetError(response.data));
    } else {
      dispatch(passwordResetSuccess(response.data));
    }
  } catch (error) {
    console.log(error);
  }
};
