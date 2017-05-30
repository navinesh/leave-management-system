//@ flow
import axios from 'axios';

import { fetchPendingLeave } from '../actions/PendingLeave';

export const APPROVE_LEAVE_REQUEST = 'APPROVE_LEAVE_REQUEST';
export const APPROVE_LEAVE_SUCCESS = 'APPROVE_LEAVE_SUCCESS';
export const APPROVE_LEAVE_ERROR = 'APPROVE_LEAVE_ERROR';

export const requestApproveLeave = (approveLeaveData: Object) => ({
  type: APPROVE_LEAVE_REQUEST,
  approveLeaveData
});

export const receiveApproveLeave = (data: Object) => ({
  type: APPROVE_LEAVE_SUCCESS,
  message: data.message
});

export const errorApproveLeave = (data: Object) => ({
  type: APPROVE_LEAVE_ERROR,
  message: data.message
});

export const submitApproveLeave = (approveLeaveData: Object) => {
  return dispatch => {
    dispatch(requestApproveLeave(approveLeaveData));
    axios
      .post('http://localhost:8080/approveleave', {
        leave_id: approveLeaveData.leaveID,
        leaveStatus: approveLeaveData.leaveStatus,
        userID: approveLeaveData.userID,
        leaveDays: approveLeaveData.leaveDays,
        leaveName: approveLeaveData.leaveName
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(errorApproveLeave(response.data));
        } else {
          dispatch(receiveApproveLeave(response.data));
          dispatch(fetchPendingLeave());
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
};
