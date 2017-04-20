// @flow
import axios from 'axios';

export const ARCHIVE_USER_REQUEST = 'ARCHIVE_USER_REQUEST';
export const ARCHIVE_USER_SUCCESS = 'ARCHIVE_USER_SUCCESS';
export const ARCHIVE_USER_FAILURE = 'ARCHIVE_USER_FAILURE';
export const CLEAR_ARCHIVE_MESSAGE = 'CLEAR_ARCHIVE_MESSAGE';

export function requestArchiveUser(archiveUser: Object) {
  return { type: ARCHIVE_USER_REQUEST, archiveUser };
}

export function successArchiveUser(data: Object) {
  return { type: ARCHIVE_USER_SUCCESS, message: data.message };
}

export function failureArchiveUser(data: Object) {
  return { type: ARCHIVE_USER_FAILURE, message: data.message };
}

export const clearArchiveMessage = () => ({ type: CLEAR_ARCHIVE_MESSAGE });

export function submitArchiveUser(archiveUser: Object) {
  return (dispatch: Function) => {
    dispatch(requestArchiveUser(archiveUser));
    axios
      .post('http://localhost:8080/archiveuser', {
        user_id: archiveUser.id,
        isArchived: archiveUser.isArchived,
        archiveReason: archiveUser.archiveReason
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(failureArchiveUser(response.data));
        } else {
          dispatch(successArchiveUser(response.data));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
}
