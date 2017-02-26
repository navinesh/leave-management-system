import axios from "axios";
import { fetchUserRecord } from "../actions/userrecord";

export const LEAVE_APPLICATION_REQUEST = "LEAVE_APPLICATION_REQUEST";
export const LEAVE_APPLICATION_SUCCESS = "LEAVE_APPLICATION_SUCCESS";
export const LEAVE_APPLICATION_FAILURE = "LEAVE_APPLICATION_FAILURE";

export function requestLeaveApplication(applicationDetails) {
  return { type: LEAVE_APPLICATION_REQUEST, applicationDetails };
}

export function receiveLeaveApplication() {
  return { type: LEAVE_APPLICATION_SUCCESS };
}

export function leaveApplicationFailure(data) {
  return { type: LEAVE_APPLICATION_FAILURE, message: data.message };
}

export function fetchLeaveApplication(applicationDetails) {
  return (dispatch, getState) => {
    dispatch(requestLeaveApplication(applicationDetails));
    axios
      .post("http://localhost:8080/applyforleave", {
        user_id: applicationDetails.user_id,
        leave: applicationDetails.leave,
        leaveType: applicationDetails.leaveType,
        startDate: applicationDetails.startDate,
        endDate: applicationDetails.endDate,
        supervisorEmail: applicationDetails.supervisorEmail,
        secretaryEmail: applicationDetails.secretaryEmail,
        leaveDays: applicationDetails.leaveDays,
        applicationDays: applicationDetails.applicationDays,
        reason: applicationDetails.reason,
        sickSheet: applicationDetails.sickSheet
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(leaveApplicationFailure(response.data));
        } else {
          dispatch(receiveLeaveApplication());
          dispatch(fetchUserRecord(getState().userAuth.auth_info.auth_token));
        }
      });
  };
}
