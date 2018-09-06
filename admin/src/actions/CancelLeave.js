// @flow
import axios from 'axios';

export const CANCEL_LEAVE_REQUEST = 'CANCEL_LEAVE_REQUEST';
export const CANCEL_LEAVE_SUCCESS = 'CANCEL_LEAVE_SUCCESS';
export const CANCEL_LEAVE_ERROR = 'CANCEL_LEAVE_ERROR';
export const CLEAR_CANCEL_LEAVE = 'CLEAR_CANCEL_LEAVE';

export function requestCancelLeave(cancelLeaveData: Object) {
  return {
    type: CANCEL_LEAVE_REQUEST,
    cancelLeaveData
  };
}

export function receiveCancelLeave(data: Object) {
  return {
    type: CANCEL_LEAVE_SUCCESS,
    message: data.message
  };
}

export function errorCancelLeave(data: Object) {
  return {
    type: CANCEL_LEAVE_ERROR,
    message: data.message
  };
}

export function clearApproveLeave() {
  return {
    type: CLEAR_CANCEL_LEAVE
  };
}

export function submitCancelLeave(cancelLeaveData: Object) {
  return async function(dispatch: Function) {
    try {
      dispatch(requestCancelLeave(cancelLeaveData));
      const response = await axios.post('http://localhost:8080/cancelleave', {
        leaveID: cancelLeaveData.leaveID,
        cancelReason: cancelLeaveData.reason,
        userID: cancelLeaveData.userID,
        leaveDays: cancelLeaveData.leaveDays,
        leaveName: cancelLeaveData.leaveName,
        leaveStatus: cancelLeaveData.leaveStatus,
        admin_user: cancelLeaveData.adminUser
      });

      if (response.status !== 201) {
        dispatch(errorCancelLeave(response.data));
      } else {
        dispatch(receiveCancelLeave(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
}
