import axios from "axios";

export const LOGIN_USER_REQUEST = "LOGIN_USER_REQUEST";
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export const LOGIN_USER_FAILURE = "LOGIN_USER_FAILURE";

export const LOGIN_USER_REQUEST_FROM_TOKEN = "LOGIN_USER_REQUEST_FROM_TOKEN";
export const LOGIN_USER_SUCCESS_FROM_TOKEN = "LOGIN_USER_SUCCESS_FROM_TOKEN";
export const LOGIN_USER_FAILURE_FROM_TOKEN = "LOGIN_USER_FAILURE_FROM_TOKEN";
export const LOGIN_FAILURE_FROM_TOKEN = "LOGIN_FAILURE_FROM_TOKEN";

export const requestUserLogin = creds => ({ type: LOGIN_USER_REQUEST, creds });

export const receiveUserLogin = data => ({
  type: LOGIN_USER_SUCCESS,
  auth_info: data
});

export const loginUserError = data => ({
  type: LOGIN_USER_FAILURE,
  message: data.message
});

export const requestUserLoginFromToken = auth_token => ({
  type: LOGIN_USER_REQUEST_FROM_TOKEN,
  auth_token
});

export const receiveUserLoginFromToken = data => ({
  type: LOGIN_USER_SUCCESS_FROM_TOKEN,
  auth_info: data
});

export const loginUserErrorFromToken = data => ({
  type: LOGIN_USER_FAILURE_FROM_TOKEN,
  message: data.message
});

export const loginFailureFromToken = () => ({ type: LOGIN_FAILURE_FROM_TOKEN });

export const fetchLogin = creds => {
  return dispatch => {
    dispatch(requestUserLogin(creds));
    axios
      .post("http://localhost:8080/userlogin", {
        email: creds.email,
        password: creds.password
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(loginUserError(response.data));
        } else {
          localStorage.setItem("auth_token", response.data.auth_token);
          dispatch(receiveUserLogin(response.data));
        }
      });
  };
};

export const fetchLoginFromToken = auth_token => {
  return dispatch => {
    dispatch(requestUserLoginFromToken(auth_token));
    axios
      .post("http://localhost:8080/usertoken", { auth_token: auth_token })
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem("auth_token");
          dispatch(loginUserErrorFromToken(response.data));
          dispatch({ type: "CLEAR_USER_RECORD" });
          dispatch({ type: "CLEAR_USER_DETAILS" });
        } else {
          dispatch(receiveUserLoginFromToken(response.data));
        }
      });
  };
};
