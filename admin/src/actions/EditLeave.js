// @flow
import axios from "axios";

export const EDIT_LEAVE_REQUEST = "EDIT_LEAVE_REQUEST";
export const EDIT_LEAVE_SUCCESS = "EDIT_LEAVE_SUCCESS";
export const EDIT_LEAVE_FAILURE = "EDIT_LEAVE_FAILURE";
export const CLEAR_EDIT_LEAVE = "CLEAR_EDIT_LEAVE";

export function requestEditLeave(editLeaveData: Object) {
  return { type: EDIT_LEAVE_REQUEST, editLeaveData };
}

export function successEditLeave(data: Object) {
  return { type: EDIT_LEAVE_SUCCESS, message: data.message };
}

export function failureEditLeave(data: Object) {
  return { type: EDIT_LEAVE_FAILURE, message: data.message };
}

export const clearEditLeave = () => ({ type: CLEAR_EDIT_LEAVE });

export function submitEditLeave(editLeaveData: Object) {
  return (dispatch: Function) => {
    dispatch(requestEditLeave(editLeaveData));
    axios
      .post("http://localhost:8080/editleave", {
        leave_id: editLeaveData.leave_id,
        leave: editLeaveData.leave,
        leaveType: editLeaveData.leaveType,
        startDate: editLeaveData.startDate,
        endDate: editLeaveData.endDate,
        reason: editLeaveData.reason,
        leaveDays: editLeaveData.leaveDays,
        applicationDays: editLeaveData.applicationDays
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(failureEditLeave(response.data));
        } else {
          dispatch(successEditLeave(response.data));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
}
