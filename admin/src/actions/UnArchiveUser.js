// @flow
import axios from 'axios';

export const UNARCHIVE_USER_REQUEST = 'UNARCHIVE_USER_REQUEST';
export const UNARCHIVE_USER_SUCCESS = 'UNARCHIVE_USER_SUCCESS';
export const UNARCHIVE_USER_FAILURE = 'UNARCHIVE_USER_FAILURE';
export const CLEAR_UNARCHIVE_MESSAGE = 'CLEAR_UNARCHIVE_MESSAGE';

export const requestUnArchiveUser = (unArchiveUser: Object) => {
  return { type: UNARCHIVE_USER_REQUEST, unArchiveUser };
};

export const successUnArchiveUser = (data: Object) => {
  return { type: UNARCHIVE_USER_SUCCESS, message: data.message };
};

export const failureUnArchiveUser = (data: Object) => {
  return { type: UNARCHIVE_USER_FAILURE, message: data.message };
};

export const clearUnArchiveMessage = () => ({ type: CLEAR_UNARCHIVE_MESSAGE });

export const submitUnArchiveUser = (unArchiveUser: Object) => {
  return async (dispatch: Function) => {
    try {
      dispatch(requestUnArchiveUser(unArchiveUser));
      const response = await axios.post('http://localhost:8080/unarchiveuser', {
        user_id: unArchiveUser.id,
        isArchived: unArchiveUser.isArchived
      });

      if (response.status !== 201) {
        dispatch(failureUnArchiveUser(response.data));
      } else {
        dispatch(successUnArchiveUser(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
