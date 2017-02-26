import axios from "axios";
import { fetchStaffRecord } from "../actions/StaffRecord";

export const MODIFY_USER_RECORD_REQUEST = "MODIFY_USER_RECORD_REQUEST";
export const MODIFY_USER_RECORD_SUCCESS = "MODIFY_USER_RECORD_SUCCESS";
export const MODIFY_USER_RECORD_FAILURE = "Modify_USER_RECORD_FAILURE";
export const CLEAR_MODIFY_USER_MESSAGE = "CLEAR_MODIFY_USER_MESSAGE";

export function requestModifyUserRecord(modifyUserDetails) {
  return { type: MODIFY_USER_RECORD_REQUEST, modifyUserDetails };
}

export function successModifyUserRecord(data) {
  return { type: MODIFY_USER_RECORD_SUCCESS, message: data.message };
}

export function failureModifyUserRecord(data) {
  return { type: MODIFY_USER_RECORD_FAILURE, message: data.message };
}

export const clearAModifyUser = () => ({ type: CLEAR_MODIFY_USER_MESSAGE });

export function submitModifyUserRecord(modifyUserDetails) {
  return dispatch => {
    dispatch(requestModifyUserRecord(modifyUserDetails));
    axios
      .post("http://localhost:8080/modifyuser", {
        user_id: modifyUserDetails.id,
        surname: modifyUserDetails.surname,
        othernames: modifyUserDetails.othernames,
        email: modifyUserDetails.staffEmail,
        designation: modifyUserDetails.designation,
        annual: modifyUserDetails.annualDays,
        sick: modifyUserDetails.sickDays,
        bereavement: modifyUserDetails.bereavmentDays,
        christmas: modifyUserDetails.christmasDays,
        date_of_birth: modifyUserDetails.dateOfBirth,
        maternity: modifyUserDetails.maternityDays,
        gender: modifyUserDetails.gender
      })
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
