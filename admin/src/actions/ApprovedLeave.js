// @flow
export const REQUEST_APPROVED_LEAVE = 'REQUEST_APPROVED_LEAVE';
export const RECEIVE_APPROVED_LEAVE = 'RECEIVE_APPROVED_LEAVE';
export const ERROR_APPROVED_LEAVE = 'ERROR_APPROVED_LEAVE';

export const requestApprovedLeave = () => ({
  type: REQUEST_APPROVED_LEAVE
});

export const receiveApprovedLeave = (data: Object) => ({
  type: RECEIVE_APPROVED_LEAVE,
  approved_records: data.approved_leave_records,
  receivedAt: Date.now()
});

export const errorApprovedLeave = () => ({
  type: ERROR_APPROVED_LEAVE
});

export const fetchApprovedLeave = () => {
  return async (dispatch: Function) => {
    try {
      dispatch(requestApprovedLeave());
      const response = await fetch(`http://localhost:8080/approved-leave.api`);
      const data = await response.json();
      dispatch(receiveApprovedLeave(data));
    } catch (error) {
      dispatch(errorApprovedLeave());
    }
  };
};
