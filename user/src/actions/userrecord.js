import axios from 'axios'

export const REQUEST_USER_RECORD = 'REQUEST_USER_RECORD'
export const RECEIVE_USER_RECORD = 'RECEIVE_USER_RECORD'
export const USER_RECORD_ERROR = 'USER_RECORD_ERROR'
export const CLEAR_USER_RECORD = 'CLEAR_USER_RECORD'

export const requestUserRecord = (auth_token) => ({
  type: REQUEST_USER_RECORD,
  auth_token
})

export const userRecordError = (data) => ({
  type: USER_RECORD_ERROR,
  message: data.message
})

export const receiveUserRecord = (data) => ({
  type: RECEIVE_USER_RECORD,
  user_record: data.user_record
})

export const clearUserRecord = () => ({
  type: CLEAR_USER_RECORD
})

export const fetchUserRecord = (auth_token) => {
  return dispatch => {
    dispatch(requestUserRecord(auth_token))
    axios({
      url: 'user-record.api',
      auth: { username: auth_token }
      })
      .then((response) => {
        if (response.status === 200){
          dispatch(userRecordError(response.data))
        }
        else {
          dispatch(receiveUserRecord(response.data))
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

export const shouldfetchUserRecord = (state, userRecords) => {
  const recordState = state.userRecords
  const { userRecord } = recordState
  const records = userRecord.length

  if(!records) {
    return true
  }
  else if(recordState.isFetching) {
    return false
  }
}

export const fetchUserRecordIfNeeded = (auth_token) => {
  return (dispatch, getState) => {
    if (shouldfetchUserRecord(getState(), auth_token)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchUserRecord(auth_token))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}
