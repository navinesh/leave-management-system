export const REQUEST_APPROVED_LEAVE = "REQUEST_APPROVED_LEAVE";
export const RECEIVE_APPROVED_LEAVE = "RECEIVE_APPROVED_LEAVE";
export const ERROR_APPROVED_LEAVE = "ERROR_APPROVED_LEAVE";

export const requestApprovedLeave = () => ({
  type: REQUEST_APPROVED_LEAVE
});

export const receiveApprovedLeave = json => ({
  type: RECEIVE_APPROVED_LEAVE,
  approved_records: json.approved_leave_records,
  receivedAt: Date.now()
});

export const errorApprovedLeave = () => ({
  type: ERROR_APPROVED_LEAVE
});

export const fetchApprovedLeave = () => {
  return dispatch => {
    dispatch(requestApprovedLeave());
    return fetch(`http://localhost:8080/approved-leave.api`)
      .then(response => response.json())
      .then(json => dispatch(receiveApprovedLeave(json)))
      .catch(error => {
        dispatch(errorApprovedLeave());
      });
  };
};
