// @flow
import axios from "axios";

export const UNARCHIVE_USER_REQUEST = "UNARCHIVE_USER_REQUEST";
export const UNARCHIVE_USER_SUCCESS = "UNARCHIVE_USER_SUCCESS";
export const UNARCHIVE_USER_FAILURE = "UNARCHIVE_USER_FAILURE";
export const CLEAR_UNARCHIVE_MESSAGE = "CLEAR_UNARCHIVE_MESSAGE";

export function requestUnArchiveUser(unArchiveUser: Object) {
  return { type: UNARCHIVE_USER_REQUEST, unArchiveUser };
}

export function successUnArchiveUser(data: Object) {
  return { type: UNARCHIVE_USER_SUCCESS, message: data.message };
}

export function failureUnArchiveUser(data: Object) {
  return { type: UNARCHIVE_USER_FAILURE, message: data.message };
}

export const clearUnArchiveMessage = () => ({ type: CLEAR_UNARCHIVE_MESSAGE });

export function submitUnArchiveUser(unArchiveUser: Object) {
  return (dispatch: Function) => {
    dispatch(requestUnArchiveUser(unArchiveUser));
    axios
      .post("http://localhost:8080/unarchiveuser", {
        user_id: unArchiveUser.id,
        isArchived: unArchiveUser.isArchived
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(failureUnArchiveUser(response.data));
        } else {
          dispatch(successUnArchiveUser(response.data));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
}
