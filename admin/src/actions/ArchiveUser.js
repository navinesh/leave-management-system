// @flow
import axios from 'axios';

export const ARCHIVE_USER_REQUEST = 'ARCHIVE_USER_REQUEST';
export const ARCHIVE_USER_SUCCESS = 'ARCHIVE_USER_SUCCESS';
export const ARCHIVE_USER_FAILURE = 'ARCHIVE_USER_FAILURE';
export const CLEAR_ARCHIVE_MESSAGE = 'CLEAR_ARCHIVE_MESSAGE';

export const requestArchiveUser = (archiveUser: Object) => {
  return { type: ARCHIVE_USER_REQUEST, archiveUser };
};

export const successArchiveUser = (data: Object) => {
  return { type: ARCHIVE_USER_SUCCESS, message: data.message };
};

export const failureArchiveUser = (data: Object) => {
  return { type: ARCHIVE_USER_FAILURE, message: data.message };
};

export const clearArchiveMessage = () => ({ type: CLEAR_ARCHIVE_MESSAGE });

export const submitArchiveUser = (archiveUser: Object) => {
  return async (dispatch: Function) => {
    try {
      dispatch(requestArchiveUser(archiveUser));
      const response = await axios.post('http://localhost:8080/archiveuser', {
        user_id: archiveUser.id,
        isArchived: archiveUser.isArchived,
        archiveReason: archiveUser.archiveReason
      });

      if (response.status !== 201) {
        dispatch(failureArchiveUser(response.data));
      } else {
        dispatch(successArchiveUser(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
