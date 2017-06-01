// @flow
export const REQUEST_PENDING_LEAVE = 'REQUEST_PENDING_LEAVE';
export const RECEIVE_PENDING_LEAVE = 'RECEIVE_PENDING_LEAVE';
export const ERROR_PENDING_LEAVE = 'ERROR_PENDING_LEAVE';

export const requestPendingLeave = () => ({
  type: REQUEST_PENDING_LEAVE
});

export const receivePendingLeave = (data: Object) => ({
  type: RECEIVE_PENDING_LEAVE,
  pending_records: data.pending_leave_records,
  receivedAt: Date.now()
});

export const errorPendingLeave = () => ({
  type: ERROR_PENDING_LEAVE
});

export const fetchPendingLeave = () => {
  return async (dispatch: Function) => {
    try {
      dispatch(requestPendingLeave());
      const response = await fetch(`http://localhost:8080/pending-leave.api`);
      const data = await response.json();
      dispatch(receivePendingLeave(data));
    } catch (error) {
      dispatch(errorPendingLeave());
    }
  };
};
