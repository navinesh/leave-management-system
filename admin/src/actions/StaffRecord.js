// @flow
export const REQUEST_STAFF_RECORD = 'REQUEST_STAFF_RECORD';
export const RECEIVE_STAFF_RECORD = 'RECEIVE_STAFF_RECORD';
export const ERROR_STAFF_RECORD = 'ERROR_STAFF_RECORD';
export const STAFF_RECORD_SEARCH = 'STAFF_RECORD_SEARCH';
export const CLEAR_STAFF_RECORD_SEARCH = 'CLEAR_STAFF_RECORD_SEARCH';

export const requestStaffRecord = () => ({
  type: REQUEST_STAFF_RECORD
});

export const receiveStaffRecord = (data: Object) => ({
  type: RECEIVE_STAFF_RECORD,
  staff_record: data.staff_record,
  receivedAt: Date.now()
});

export const errorStaffRecord = () => ({
  type: ERROR_STAFF_RECORD
});

export const searchStaffRecord = (searchTerm: string) => ({
  type: STAFF_RECORD_SEARCH,
  searchTerm
});

export const clearSearchStaffRecord = () => {
  return {
    type: CLEAR_STAFF_RECORD_SEARCH
  };
};

export const fetchStaffRecord = () => async (dispatch: Function) => {
  try {
    dispatch(requestStaffRecord());
    const response = await fetch(`http://localhost:8080/staff-record.api`);
    const data = await response.json();
    dispatch(receiveStaffRecord(data));
  } catch (error) {
    dispatch(errorStaffRecord());
  }
};
