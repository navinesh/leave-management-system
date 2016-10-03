export const REQUEST_PENDING_LEAVE = 'REQUEST_PENDING_LEAVE'
export const RECEIVE_PENDING_LEAVE = 'RECEIVE_PENDING_LEAVE'
export const ERROR_PENDING_LEAVE = 'ERROR_PENDING_LEAVE'

export const requestPendingLeave = () => ({
  type: REQUEST_PENDING_LEAVE
})

export const receivePendingLeave = (json) => ({
  type: RECEIVE_PENDING_LEAVE,
  pending_records: json.pending_leave_records,
  receivedAt: Date.now()
})

export const errorPendingLeave = () => ({
  type: ERROR_PENDING_LEAVE
})

export const fetchPendingLeave = () => {
  return dispatch => {
    dispatch(requestPendingLeave())
    return fetch(`http://localhost:8080/pending-leave.api`)
      .then(response => response.json())
      .then(json => dispatch(receivePendingLeave(json)))
      .catch((error) => {
        dispatch(errorPendingLeave())
      })
  }
}
