//@ flow
import axios from "axios";

import { fetchPendingLeave } from "../actions/PendingLeave";

export const APPROVE_LEAVE_REQUEST = "APPROVE_LEAVE_REQUEST";
export const APPROVE_LEAVE_SUCCESS = "APPROVE_LEAVE_SUCCESS";
export const APPROVE_LEAVE_ERROR = "APPROVE_LEAVE_ERROR";

export const requestApproveLeave = () => ({
  type: APPROVE_LEAVE_REQUEST
});

export const receiveApproveLeave = data => ({
  type: APPROVE_LEAVE_SUCCESS,
  message: data.message
});

export const errorApproveLeave = data => ({
  type: APPROVE_LEAVE_ERROR,
  message: data.message
});

export function submitApproveLeave(approveLeaveData) {
  return dispatch => {
    dispatch(requestApproveLeave(approveLeaveData));
    axios
      .post("http://localhost:8080/approveleave", {
        leave_id: approveLeaveData.leaveID,
        LeaveStatus: approveLeaveData.LeaveStatus
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
}
