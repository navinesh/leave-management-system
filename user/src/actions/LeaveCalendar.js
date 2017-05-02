import fetch from "isomorphic-fetch";

export const REQUEST_LEAVE_CALENDAR = "REQUEST_LEAVE_CALENDAR";
export const RECEIVE_LEAVE_CALENDAR = "RECEIVE_LEAVE_CALENDAR";

export const requestLeave = () => ({ type: REQUEST_LEAVE_CALENDAR });

export const receiveLeave = json => ({
  type: RECEIVE_LEAVE_CALENDAR,
  records: json.approved_leave_records,
  receivedAt: Date.now()
});

export const fetchLeave = () => {
  return dispatch => {
    dispatch(requestLeave());
    return fetch(`http://localhost:8080/approved-leave.api`)
      .then(response => response.json())
      .then(json => dispatch(receiveLeave(json)));
  };
};

export const shouldfetchLeave = (state, leaveRecords) => {
  const leaveState = state.leaveRecords;
  const { items } = leaveState;
  const item = items.length;

  if (!item) {
    return true;
  } else if (leaveState.isFetching) {
    return false;
  }
};

export const fetchLeaveIfNeeded = () => {
  return (dispatch, getState) => {
    if (shouldfetchLeave(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchLeave());
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve();
    }
  };
};
