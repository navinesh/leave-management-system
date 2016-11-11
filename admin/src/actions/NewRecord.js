import axios from 'axios'

export const NEW_USER_RECORD_REQUEST = 'NEW_USER_RECORD_REQUEST'
export const NEW_USER_RECORD_SUCCESS = 'NEW_USER_RECORD_SUCCESS'
export const NEW_USER_RECORD_FAILURE = 'NEW_USER_RECORD_FAILURE'

export function requestNewUserRecord(newUserDetails) {
  return {
    type: NEW_USER_RECORD_REQUEST,
    newUserDetails
  }
}

export function successNewUserRecord() {
  return {
    type: NEW_USER_RECORD_SUCCESS
  }
}

export function failureNewUserRecord(data){
  return {
    type: NEW_USER_RECORD_FAILURE,
    message: data.message
  }
}

export function submitNewUserRecord(newUserDetails) {
  return dispatch => {
    dispatch(requestNewUserRecord(newUserDetails))
    let data = new FormData();
    data.append('surname', newUserDetails.surname);
    data.append('othernames', newUserDetails.othernames);
    data.append('email', newUserDetails.staffEmail);
    data.append('designation', newUserDetails.designation);
    data.append('annual', newUserDetails.annualDays);
    data.append('sick', newUserDetails.sickDays);
    data.append('bereavement', newUserDetails.bereavmentDays);
    data.append('christmas', newUserDetails.christmasDays);
    data.append('date_of_birth', newUserDetails.dateOfBirth);
    data.append('maternity', newUserDetails.maternityDays);
    data.append('gender', newUserDetails.gender);
    axios.post('adduser', data)
      .then((response) => {
        if (response.status === 200){
          dispatch(failureNewUserRecord(response.data))
        }
        else {
          dispatch(successNewUserRecord())
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
