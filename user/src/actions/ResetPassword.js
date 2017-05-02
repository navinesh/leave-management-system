import axios from "axios";

export const REQUEST_PASSWORD_RESET = "REQUEST_PASSWORD_RESET";
export const PASSWORD_RESET_SUCCESS = "PASSWORD_RESET_SUCCESS";
export const PASSWORD_RESET_ERROR = "PASSWORD_RESET_ERROR";

export function requestPasswordReset(email) {
  return { type: REQUEST_PASSWORD_RESET, email };
}

export function passwordResetError(data) {
  return { type: PASSWORD_RESET_ERROR, message: data.message };
}

export function passwordResetSuccess(data) {
  return { type: PASSWORD_RESET_SUCCESS, message: data.message };
}

export function resetPassword(email) {
  return dispatch => {
    dispatch(requestPasswordReset(email));
    axios
      .post("http://localhost:8080/reset-password.api", { email: email })
      .then(response => {
        if (response.status === 200) {
          dispatch(passwordResetError(response.data));
        } else {
          dispatch(passwordResetSuccess(response.data));
        }
      });
  };
}
