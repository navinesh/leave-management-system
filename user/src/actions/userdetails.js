import axios from 'axios'

export const REQUEST_USER_DETAILS = 'REQUEST_USER_DETAILS'
export const RECEIVE_USER_DETAILS = 'RECEIVE_USER_DETAILS'
export const USER_DETAILS_ERROR = 'USER_DETAILS_ERROR'
export const CLEAR_USER_DETAILS = 'CLEAR_USER_DETAILS'

export const requestUserDetails = (auth_token) => ({
  type: REQUEST_USER_DETAILS,
  auth_token
})

export const userDetailsError = (data) => ({
  type: USER_DETAILS_ERROR,
  message: data.message
})

export const receiveUserDetails = (data) => ({
  type: RECEIVE_USER_DETAILS,
  user_detail: data.user_detail
})

export const clearUserDetails = () => ({
  type: CLEAR_USER_DETAILS
})

export const fetchUserDetails = (auth_token) => {
  return dispatch => {
    dispatch(requestUserDetails(auth_token))
    axios({
      url: 'user-detail.api',
      auth: { username: auth_token }
      })
      .then((response) => {
        if (response.status === 200){
          dispatch(userDetailsError(response.data))
        }
        else {
          dispatch(receiveUserDetails(response.data))
        }
      })
      .catch((error) => {
        localStorage.removeItem('auth_token')
        dispatch({ type: 'LOGIN_FAILURE_FROM_TOKEN' })
        dispatch({ type: 'CLEAR_USER_RECORD' })
        dispatch({ type: 'CLEAR_USER_DETAILS' })
      })
  }
}

export const shouldfetchUserDetails = (state, userDetails) => {
  const userState = state.userDetails
  const { userDetail } = userState
  const details = Object.keys(userDetail).length

  if(!details) {
    return true
  }
  else if(userState.isFetching) {
    return false
  }
}

export const fetchUserDetailsIfNeeded = (auth_token) => {
  return (dispatch, getState) => {
    if (shouldfetchUserDetails(getState(), auth_token)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchUserDetails(auth_token))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}
