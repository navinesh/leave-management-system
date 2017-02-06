import axios from "axios";
import { fetchStaffRecord } from "../actions/StaffRecord";

export const ARCHIVE_USER_REQUEST = "ARCHIVE_USER_REQUEST";
export const ARCHIVE_USER_SUCCESS = "ARCHIVE_USER_SUCCESS";
export const ARCHIVE_USER_FAILURE = "ARCHIVE_USER_FAILURE";
export const CLEAR_ARCHIVE_MESSAGE = "CLEAR_ARCHIVE_MESSAGE";

export function requestArchiveUser(modifyUserDetails) {
  return { type: ARCHIVE_USER_REQUEST, modifyUserDetails };
}

export function successArchiveUser(data) {
  return { type: ARCHIVE_USER_SUCCESS, message: data.message };
}

export function failureArchiveUser(data) {
  return { type: ARCHIVE_USER_FAILURE, message: data.message };
}

export const clearArchiveMessage = () => ({ type: CLEAR_ARCHIVE_MESSAGE });

export function submitArchiveUser(archiveUser) {
  return dispatch => {
    dispatch(requestArchiveUser(archiveUser));
    let data = new FormData();
    data.append("user_id", archiveUser.id);
    data.append("isArchived", archiveUser.isArchived);
    data.append("archiveReason", archiveUser.archiveReason);
    axios
      .post("http://localhost:8080/archiveuser", data)
      .then(response => {
        if (response.status === 200) {
          dispatch(failureArchiveUser(response.data));
        } else {
          dispatch(successArchiveUser(response.data));
          dispatch(fetchStaffRecord());
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
}
