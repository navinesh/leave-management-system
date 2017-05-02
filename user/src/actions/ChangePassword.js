import axios from "axios";

export const REQUEST_PASSWORD_CHANGE = "REQUEST_PASSWORD_CHANGE";
export const PASSWORD_CHANGE_SUCCESS = "PASSWORD_CHANGE_SUCCESS";
export const PASSWORD_CHANGE_ERROR = "PASSWORD_CHANGE_ERROR";
export const CLEAR_CHANGE_PASSWORD_ERROR = "CLEAR_CHANGE_PASSWORD_ERROR";

export const requestPasswordChange = creds => {
  return { type: REQUEST_PASSWORD_CHANGE, creds };
};

export const passwordChangeError = data => {
  return { type: PASSWORD_CHANGE_ERROR, message: data.message };
};

export const passwordChangeSuccess = data => {
  return { type: PASSWORD_CHANGE_SUCCESS, message: data.message };
};

export const clearChangePasswordError = () => {
  return { type: CLEAR_CHANGE_PASSWORD_ERROR };
};

export function changePassword(creds) {
  return dispatch => {
    dispatch(requestPasswordChange(creds));
    axios({
      method: "post",
      url: "http://localhost:8080/change-password",
      auth: { username: creds.auth_token },
      data: {
        oldPassword: creds.currentPassword,
        newPassword: creds.newPassword
      }
    })
      .then(response => {
        if (response.status === 200) {
          dispatch(passwordChangeError(response.data));
        } else {
          dispatch(passwordChangeSuccess(response.data));
        }
      })
      .catch(error => {
        localStorage.removeItem("auth_token");
        dispatch({ type: "LOGIN_FAILURE_FROM_TOKEN" });
        dispatch({ type: "CLEAR_USER_RECORD" });
        dispatch({ type: "CLEAR_USER_DETAILS" });
      });
  };
}
