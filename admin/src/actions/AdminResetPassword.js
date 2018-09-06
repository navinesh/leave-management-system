// @flow
import axios from 'axios';

export const REQUEST_PASSWORD_RESET = 'REQUEST_PASSWORD_RESET';
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
export const PASSWORD_RESET_ERROR = 'PASSWORD_RESET_ERROR';

export function requestPasswordReset(email: string) {
  return { type: REQUEST_PASSWORD_RESET, email };
}

export function passwordResetError(data: Object) {
  return { type: PASSWORD_RESET_ERROR, message: data.message };
}

export function passwordResetSuccess(data: Object) {
  return { type: PASSWORD_RESET_SUCCESS, message: data.message };
}

export function resetPassword(email: string) {
  return async function(dispatch: Function) {
    try {
      dispatch(requestPasswordReset(email));
      const response = await axios.post(
        'http://localhost:8080/admin-reset-password',
        {
          email: email
        }
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
}
