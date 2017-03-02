export const REQUEST_ARCHIVED_STAFF_RECORD = "REQUEST_ARCHIVED_STAFF_RECORD";
export const RECEIVE_ARCHIVED_STAFF_RECORD = "RECEIVE_ARCHIVED_STAFF_RECORD";
export const ERROR_ARCHIVED_STAFF_RECORD = "ERROR_ARCHIVED_STAFF_RECORD";

export const requestArchivedStaffRecord = () => ({
  type: REQUEST_ARCHIVED_STAFF_RECORD
});

export const receiveArchivedStaffRecord = json => ({
  type: RECEIVE_ARCHIVED_STAFF_RECORD,
  archived_staff_record: json.archived_staff_record,
  receivedAt: Date.now()
});

export const errorArchivedStaffRecord = () => ({
  type: ERROR_ARCHIVED_STAFF_RECORD
});

export const fetchArchivedStaffRecord = () => {
  return dispatch => {
    dispatch(requestArchivedStaffRecord());
    return fetch(`http://localhost:8080/archived-staff-record.api`)
      .then(response => response.json())
      .then(json => dispatch(receiveArchivedStaffRecord(json)))
      .catch(error => {
        dispatch(errorArchivedStaffRecord());
      });
  };
};
