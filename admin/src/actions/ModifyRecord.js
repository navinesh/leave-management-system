// @flow
import axios from 'axios';

export const MODIFY_USER_RECORD_REQUEST = 'MODIFY_USER_RECORD_REQUEST';
export const MODIFY_USER_RECORD_SUCCESS = 'MODIFY_USER_RECORD_SUCCESS';
export const MODIFY_USER_RECORD_FAILURE = 'Modify_USER_RECORD_FAILURE';
export const CLEAR_MODIFY_USER_MESSAGE = 'CLEAR_MODIFY_USER_MESSAGE';

export function requestModifyUserRecord(modifyUserDetails: Object) {
  return { type: MODIFY_USER_RECORD_REQUEST, modifyUserDetails };
}

export function successModifyUserRecord(data: Object) {
  return { type: MODIFY_USER_RECORD_SUCCESS, message: data.message };
}

export function failureModifyUserRecord(data: Object) {
  return { type: MODIFY_USER_RECORD_FAILURE, message: data.message };
}

export function clearModifyUser() {
  return { type: CLEAR_MODIFY_USER_MESSAGE };
}

export function submitModifyUserRecord(modifyUserDetails: Object) {
  return async function(dispatch: Function) {
    try {
      dispatch(requestModifyUserRecord(modifyUserDetails));
      const response = await axios.post('http://localhost:8080/modifyuser', {
        user_id: modifyUserDetails.dbid,
        surname: modifyUserDetails.surname,
        othernames: modifyUserDetails.othernames,
        email: modifyUserDetails.staffEmail,
        designation: modifyUserDetails.designation,
        annual: modifyUserDetails.annualDays,
        sick: modifyUserDetails.sickDays,
        bereavement: modifyUserDetails.bereavmentDays,
        christmas: modifyUserDetails.christmasDays,
        date_of_birth: modifyUserDetails.dateOfBirth,
        family_care: modifyUserDetails.familyCare,
        maternity: modifyUserDetails.maternityDays,
        paternity: modifyUserDetails.paternityDays,
        gender: modifyUserDetails.gender,
        editReason: modifyUserDetails.editReason,
        employee_number: modifyUserDetails.employeeNumber,
        employee_start_date: modifyUserDetails.employeeStartDate,
        admin_user: modifyUserDetails.adminUser
      });

      if (response.status !== 201) {
        dispatch(failureModifyUserRecord(response.data));
      } else {
        dispatch(successModifyUserRecord(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
}
