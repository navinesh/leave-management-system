import axios from "axios";
import { fetchStaffRecord } from "../actions/StaffRecord";

export const MODIFY_USER_RECORD_REQUEST = "MODIFY_USER_RECORD_REQUEST";
export const MODIFY_USER_RECORD_SUCCESS = "MODIFY_USER_RECORD_SUCCESS";
export const MODIFY_USER_RECORD_FAILURE = "Modify_USER_RECORD_FAILURE";

export function requestModifyUserRecord(modifyUserDetails) {
  return { type: MODIFY_USER_RECORD_REQUEST, modifyUserDetails };
}

export function successModifyUserRecord(data) {
  return { type: MODIFY_USER_RECORD_SUCCESS, message: data.message };
}

export function failureModifyUserRecord(data) {
  return { type: MODIFY_USER_RECORD_FAILURE, message: data.message };
}

export function submitModifyUserRecord(modifyUserDetails) {
  return dispatch => {
    dispatch(requestModifyUserRecord(modifyUserDetails));
    let data = new FormData();
    data.append("user_id", modifyUserDetails.id);
    data.append("surname", modifyUserDetails.surname);
    data.append("othernames", modifyUserDetails.othernames);
    data.append("email", modifyUserDetails.staffEmail);
    data.append("designation", modifyUserDetails.designation);
    data.append("annual", modifyUserDetails.annualDays);
    data.append("sick", modifyUserDetails.sickDays);
    data.append("bereavement", modifyUserDetails.bereavmentDays);
    data.append("christmas", modifyUserDetails.christmasDays);
    data.append("date_of_birth", modifyUserDetails.dateOfBirth);
    data.append("maternity", modifyUserDetails.maternityDays);
    data.append("gender", modifyUserDetails.gender);
    axios
      .post("http://localhost:8080/modifyuser", data)
      .then(response => {
        if (response.status === 200) {
          dispatch(failureModifyUserRecord(response.data));
        } else {
          dispatch(successModifyUserRecord(response.data));
          dispatch(fetchStaffRecord());
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
}
