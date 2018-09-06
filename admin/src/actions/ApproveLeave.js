//@ flow
import axios from 'axios';

export const APPROVE_LEAVE_REQUEST = 'APPROVE_LEAVE_REQUEST';
export const APPROVE_LEAVE_SUCCESS = 'APPROVE_LEAVE_SUCCESS';
export const APPROVE_LEAVE_ERROR = 'APPROVE_LEAVE_ERROR';
export const CLEAR_APPROVE_LEAVE = 'CLEAR_APPROVE_LEAVE';

export function requestApproveLeave(approveLeaveData: Object) {
  return {
    type: APPROVE_LEAVE_REQUEST,
    approveLeaveData
  };
}

export function receiveApproveLeave(data: Object) {
  return {
    type: APPROVE_LEAVE_SUCCESS,
    message: data.message
  };
}

export function errorApproveLeave(data: Object) {
  return {
    type: APPROVE_LEAVE_ERROR,
    message: data.message
  };
}

export function clearApproveLeave() {
  return {
    type: CLEAR_APPROVE_LEAVE
  };
}

export function submitApproveLeave(approveLeaveData: Object) {
  return async function(dispatch: Function) {
    try {
      dispatch(requestApproveLeave(approveLeaveData));
      const response = await axios.post('http://localhost:8080/approveleave', {
        leave_id: approveLeaveData.leaveID,
        leaveStatus: approveLeaveData.leaveStatus,
        userID: approveLeaveData.userID,
        leaveDays: approveLeaveData.leaveDays,
        leaveName: approveLeaveData.leaveName,
        admin_user: approveLeaveData.adminUser
      });

      if (response.status !== 201) {
        dispatch(errorApproveLeave(response.data));
      } else {
        dispatch(receiveApproveLeave(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
}
