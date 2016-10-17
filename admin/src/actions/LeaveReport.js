export const REQUEST_LEAVE_RECORD = 'REQUEST_LEAVE_RECORD'
export const RECEIVE_LEAVE_RECORD = 'RECEIVE_LEAVE_RECORD'
export const ERROR_LEAVE_RECORD = 'ERROR_LEAVE_RECORD'

export const requestLeaveRecord = () => ({
  type: REQUEST_LEAVE_RECORD
})

export const receiveLeaveRecord = (json) => ({
  type: RECEIVE_LEAVE_RECORD,
  leave_record: json.leave_record,
  receivedAt: Date.now()
})

export const errorLeaveRecord = () => ({
  type: ERROR_LEAVE_RECORD
})

export const fetchLeaveRecord = () => {
  return dispatch => {
    dispatch(requestLeaveRecord())
    return fetch(`http://localhost:8080/leave-record.api`)
      .then(response => response.json())
      .then(json => dispatch(receiveLeaveRecord(json)))
      .catch((error) => {
        dispatch(errorLeaveRecord())
      })
  }
}
