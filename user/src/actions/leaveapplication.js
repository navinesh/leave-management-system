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

    let data = new FormData();
    data.append("user_id", applicationDetails.user_id);
    data.append("leave", applicationDetails.leave);
    data.append("leaveType", applicationDetails.leaveType);
    data.append("startDate", applicationDetails.startDate);
    data.append("endDate", applicationDetails.endDate);
    data.append("supervisorEmail", applicationDetails.supervisorEmail);
    data.append("secretaryEmail", applicationDetails.secretaryEmail);
    data.append("leaveDays", applicationDetails.leaveDays);
    data.append("applicationDays", applicationDetails.applicationDays);
    data.append("reason", applicationDetails.reason);
    data.append("sickSheet", applicationDetails.sickSheet);
    axios.post("http://localhost:8080/applyforleave", data).then(response => {
      if (response.status === 200) {
        dispatch(leaveApplicationFailure(response.data));
      } else {
        dispatch(receiveLeaveApplication());
        dispatch(fetchUserRecord(getState().userAuth.auth_info.auth_token));
      }
    });
  };
}
