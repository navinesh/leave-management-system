// @flow
export const REQUEST_ARCHIVED_STAFF_RECORD = 'REQUEST_ARCHIVED_STAFF_RECORD';
export const RECEIVE_ARCHIVED_STAFF_RECORD = 'RECEIVE_ARCHIVED_STAFF_RECORD';
export const ERROR_ARCHIVED_STAFF_RECORD = 'ERROR_ARCHIVED_STAFF_RECORD';

export const requestArchivedStaffRecord = () => ({
  type: REQUEST_ARCHIVED_STAFF_RECORD
});

export const receiveArchivedStaffRecord = (data: Object) => ({
  type: RECEIVE_ARCHIVED_STAFF_RECORD,
  archived_staff_record: data.archived_staff_record,
  receivedAt: Date.now()
});

export const errorArchivedStaffRecord = () => ({
  type: ERROR_ARCHIVED_STAFF_RECORD
});

export const fetchArchivedStaffRecord = () => {
  return async (dispatch: Function) => {
    try {
      dispatch(requestArchivedStaffRecord());
      const response = await fetch(
        `http://localhost:8080/archived-staff-record.api`
      );
      const data = await response.json();
      dispatch(receiveArchivedStaffRecord(data));
    } catch (error) {
      dispatch(errorArchivedStaffRecord());
    }
  };
};
