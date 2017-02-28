import axios from "axios";

export const NEW_USER_RECORD_REQUEST = "NEW_USER_RECORD_REQUEST";
export const NEW_USER_RECORD_SUCCESS = "NEW_USER_RECORD_SUCCESS";
export const NEW_USER_RECORD_FAILURE = "NEW_USER_RECORD_FAILURE";
export const CLEAR_NEW_USER_RECORD = "CLEAR_NEW_USER_RECORD";

export function requestNewUserRecord(newUserDetails) {
  return {
    type: NEW_USER_RECORD_REQUEST,
    newUserDetails
  };
}

export function successNewUserRecord(data) {
  return {
    type: NEW_USER_RECORD_SUCCESS,
    message: data.message
  };
}

export function failureNewUserRecord(data) {
  return {
    type: NEW_USER_RECORD_FAILURE,
    message: data.message
  };
}

export const clearNewUserRecord = () => {
  return {
    type: CLEAR_NEW_USER_RECORD
  };
};

export function submitNewUserRecord(newUserDetails) {
  return dispatch => {
    dispatch(requestNewUserRecord(newUserDetails));
    axios
      .post("http://localhost:8080/adduser", {
        surname: newUserDetails.surname,
        othernames: newUserDetails.othernames,
        email: newUserDetails.staffEmail,
        designation: newUserDetails.designation,
        annual: newUserDetails.annualDays,
        sick: newUserDetails.sickDays,
        bereavement: newUserDetails.bereavementDays,
        christmas: newUserDetails.christmasDays,
        date_of_birth: newUserDetails.dateOfBirth,
        maternity: newUserDetails.maternityDays,
        gender: newUserDetails.gender
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(failureNewUserRecord(response.data));
        } else {
          dispatch(successNewUserRecord(response.data));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
}
