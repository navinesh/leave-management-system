export const LOGOUT_ADMIN_REQUEST = 'LOGOUT_ADMIN_REQUEST'
export const LOGOUT_ADMIN_SUCCESS = 'LOGOUT_ADMIN_SUCCESS'

export const requestLogout = () => ({
  type: LOGOUT_ADMIN_REQUEST
})

export const receiveLogout = () => ({
  type: LOGOUT_ADMIN_SUCCESS
})

export const logoutAdmin = () => {
  return dispatch => {
    dispatch(requestLogout())
    dispatch(receiveLogout())
    localStorage.removeItem('admin_token')
  }
}
