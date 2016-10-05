export const REQUEST_STAFF_RECORD = 'REQUEST_STAFF_RECORD'
export const RECEIVE_STAFF_RECORD = 'RECEIVE_STAFF_RECORD'
export const ERROR_STAFF_RECORD = 'ERROR_STAFF_RECORD'
export const STAFF_RECORD_SEARCH = 'STAFF_RECORD_SEARCH'
export const CLEAR_STAFF_RECORD_SEARCH = 'CLEAR_STAFF_RECORD_SEARCH'

export const requestStaffRecord = () => ({
  type: REQUEST_STAFF_RECORD
})

export const receiveStaffRecord = (json) => ({
  type: RECEIVE_STAFF_RECORD,
  staff_record: json.staff_record,
  receivedAt: Date.now()
})

export const errorStaffRecord = () => ({
  type: ERROR_STAFF_RECORD
})

export const searchStaffRecord = (searchTerm) => ({
    type: STAFF_RECORD_SEARCH,
    searchTerm
})

export const clearSearchStaffRecord = () => {
  return {
    type: CLEAR_STAFF_RECORD_SEARCH
  }
}

export const fetchStaffRecord = () => {
  return dispatch => {
    dispatch(requestStaffRecord())
    return fetch(`http://localhost:8080/staff-record.api`)
      .then(response => response.json())
      .then(json => dispatch(receiveStaffRecord(json)))
      .catch((error) => {
        dispatch(errorStaffRecord())
      })
  }
}
