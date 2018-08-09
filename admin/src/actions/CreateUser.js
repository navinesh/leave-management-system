// @flow
import axios from 'axios';

export const NEW_USER_RECORD_REQUEST = 'NEW_USER_RECORD_REQUEST';
export const NEW_USER_RECORD_SUCCESS = 'NEW_USER_RECORD_SUCCESS';
export const NEW_USER_RECORD_FAILURE = 'NEW_USER_RECORD_FAILURE';
export const CLEAR_NEW_USER_RECORD = 'CLEAR_NEW_USER_RECORD';

export const requestNewUserRecord = (newUserDetails: Object) => {
  return {
    type: NEW_USER_RECORD_REQUEST,
    newUserDetails
  };
};

export const successNewUserRecord = (data: Object) => {
  return {
    type: NEW_USER_RECORD_SUCCESS,
    message: data.message
  };
};

export const failureNewUserRecord = (data: Object) => {
  return {
    type: NEW_USER_RECORD_FAILURE,
    message: data.message
  };
};

export const clearNewUserRecordMessage = () => {
  return {
    type: CLEAR_NEW_USER_RECORD
  };
};

export const submitNewUserRecord = (newUserDetails: Object) => async (
  dispatch: Function
) => {
  try {
    dispatch(requestNewUserRecord(newUserDetails));
    const response = await axios.post('http://localhost:8080/adduser', {
      surname: newUserDetails.surname,
      othernames: newUserDetails.othernames,
      email: newUserDetails.staffEmail,
      designation: newUserDetails.designation,
      annual: newUserDetails.annualDays,
      sick: newUserDetails.sickDays,
      bereavement: newUserDetails.bereavementDays,
      family_care: newUserDetails.familyCareDays,
      christmas: newUserDetails.christmasDays,
      date_of_birth: newUserDetails.dateOfBirth,
      maternity: newUserDetails.maternityDays,
      paternity: newUserDetails.paternityDays,
      gender: newUserDetails.gender,
      admin_user: newUserDetails.adminUser
    });

    if (response.status !== 201) {
      dispatch(failureNewUserRecord(response.data));
    } else {
      dispatch(successNewUserRecord(response.data));
    }
  } catch (error) {
    console.log(error);
  }
};
