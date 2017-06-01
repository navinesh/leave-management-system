// @flow
export const REQUEST_LEAVE_RECORD = 'REQUEST_LEAVE_RECORD';
export const RECEIVE_LEAVE_RECORD = 'RECEIVE_LEAVE_RECORD';
export const ERROR_LEAVE_RECORD = 'ERROR_LEAVE_RECORD';

export const requestLeaveRecord = () => ({
  type: REQUEST_LEAVE_RECORD
});

export const receiveLeaveRecord = (data: Object) => ({
  type: RECEIVE_LEAVE_RECORD,
  leave_record: data.leave_record,
  receivedAt: Date.now()
});

export const errorLeaveRecord = () => ({
  type: ERROR_LEAVE_RECORD
});

export const fetchLeaveRecord = () => {
  return async (dispatch: Function) => {
    try {
      dispatch(requestLeaveRecord());
      const response = await fetch(`http://localhost:8080/leave-record.api`);
      const data = await response.json();
      dispatch(receiveLeaveRecord(data));
    } catch (error) {
      dispatch(errorLeaveRecord());
    }
  };
};
