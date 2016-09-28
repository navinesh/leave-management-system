import axios from 'axios'

export const LOGIN_ADMIN_REQUEST = 'LOGIN_ADMIN_REQUEST'
export const LOGIN_ADMIN_SUCCESS = 'LOGIN_ADMIN_SUCCESS'
export const LOGIN_ADMIN_FAILURE = 'LOGIN_ADMIN_FAILURE'

export const requestAdminLogin = (creds) => ({
  type: LOGIN_ADMIN_REQUEST,
  creds
})

export const receiveAdminLogin = (data) => ({
  type: LOGIN_ADMIN_SUCCESS,
  auth_info: data

})

export const loginAdminError = (data) => ({
  type: LOGIN_ADMIN_FAILURE,
  message: data.message
})


export const fetchLogin = (creds) => {
  return dispatch => {
    dispatch(requestAdminLogin(creds))
    axios.post('http://localhost:8080/adminlogin', {
        email: creds.email,
        password: creds.password
      })
      .then((response) => {
        if (response.status === 200){
          dispatch(loginAdminError(response.data))
        }
        else {
          localStorage.setItem('auth_token', response.data.auth_token)
          dispatch(receiveAdminLogin(response.data))
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
