// @flow
import axios from 'axios';

export const DECLINE_LEAVE_REQUEST = 'DECLINE_LEAVE_REQUEST';
export const DECLINE_LEAVE_SUCCESS = 'DECLINE_LEAVE_SUCCESS';
export const DECLINE_LEAVE_ERROR = 'DECLINE_LEAVE_ERROR';
export const CLEAR_DECLINE_LEAVE = 'CLEAR_DECLINE_LEAVE';

export const requestDeclineLeave = () => ({
  type: DECLINE_LEAVE_REQUEST
});

export const receiveDeclineLeave = (data: Object) => ({
  type: DECLINE_LEAVE_SUCCESS,
  message: data.message
});

export const errorDeclineLeave = (data: Object) => ({
  type: DECLINE_LEAVE_ERROR,
  message: data.message
});

export const clearDeclineLeave = () => ({ type: CLEAR_DECLINE_LEAVE });

export function submitDeclineLeave(declineLeaveData: Object) {
  return (dispatch: Function) => {
    dispatch(requestDeclineLeave(declineLeaveData));
    axios
      .post('http://localhost:8080/declineleave', {
        leave_id: declineLeaveData.leaveID,
        LeaveStatus: declineLeaveData.LeaveStatus,
        DeclineReason: declineLeaveData.DeclineReason
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(errorDeclineLeave(response.data));
        } else {
          dispatch(receiveDeclineLeave(response.data));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
}
