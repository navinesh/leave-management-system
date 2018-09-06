// @flow
import axios from 'axios';

export const DECLINE_LEAVE_REQUEST = 'DECLINE_LEAVE_REQUEST';
export const DECLINE_LEAVE_SUCCESS = 'DECLINE_LEAVE_SUCCESS';
export const DECLINE_LEAVE_ERROR = 'DECLINE_LEAVE_ERROR';
export const CLEAR_DECLINE_LEAVE = 'CLEAR_DECLINE_LEAVE';

export function requestDeclineLeave(declineLeaveData: Object) {
  return {
    type: DECLINE_LEAVE_REQUEST,
    declineLeaveData
  };
}

export function receiveDeclineLeave(data: Object) {
  return {
    type: DECLINE_LEAVE_SUCCESS,
    message: data.message
  };
}

export function errorDeclineLeave(data: Object) {
  return {
    type: DECLINE_LEAVE_ERROR,
    message: data.message
  };
}

export function clearDeclineLeave() {
  return { type: CLEAR_DECLINE_LEAVE };
}

export function submitDeclineLeave(declineLeaveData: Object) {
  return async function(dispatch: Function) {
    try {
      dispatch(requestDeclineLeave(declineLeaveData));
      const response = await axios.post('http://localhost:8080/declineleave', {
        leave_id: declineLeaveData.leaveID,
        LeaveStatus: declineLeaveData.LeaveStatus,
        DeclineReason: declineLeaveData.DeclineReason,
        admin_user: declineLeaveData.adminUser
      });

      if (response.status !== 201) {
        dispatch(errorDeclineLeave(response.data));
      } else {
        dispatch(receiveDeclineLeave(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
}
