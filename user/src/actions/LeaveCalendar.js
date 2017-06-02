// @flow
import fetch from 'isomorphic-fetch';

export const REQUEST_LEAVE_CALENDAR = 'REQUEST_LEAVE_CALENDAR';
export const RECEIVE_LEAVE_CALENDAR = 'RECEIVE_LEAVE_CALENDAR';
export const FAILURE_LEAVE_CALENDAR = 'FAILURE_LEAVE_CALENDAR';

export const requestLeave = () => ({ type: REQUEST_LEAVE_CALENDAR });

export const receiveLeave = (json: Object) => ({
  type: RECEIVE_LEAVE_CALENDAR,
  records: json.approved_leave_records,
  receivedAt: Date.now()
});

export const failureLeaveCalendar = () => ({
  type: FAILURE_LEAVE_CALENDAR
});

export const fetchLeave = () => async (dispatch: Function) => {
  try {
    dispatch(requestLeave());
    const response = await fetch(`http://localhost:8080/approved-leave.api`);
    const data = await response.json();
    dispatch(receiveLeave(data));
  } catch (error) {
    dispatch(failureLeaveCalendar());
  }
};

export const shouldfetchLeave = (state: Object, leaveRecords?: Array<any>) => {
  const leaveState = state.leaveRecords;
  const { items } = leaveState;
  const item = items.length;

  if (!item) {
    return true;
  } else if (leaveState.isFetching) {
    return false;
  }
};

export const fetchLeaveIfNeeded = () => (
  dispatch: Function,
  getState: Function
) => {
  if (shouldfetchLeave(getState())) {
    // Dispatch a thunk from thunk!
    return dispatch(fetchLeave());
  } else {
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve();
  }
};
