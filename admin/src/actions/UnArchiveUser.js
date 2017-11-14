// @flow
export const UNARCHIVE_USER_REQUEST = 'UNARCHIVE_USER_REQUEST';
export const UNARCHIVE_USER_SUCCESS = 'UNARCHIVE_USER_SUCCESS';
export const UNARCHIVE_USER_FAILURE = 'UNARCHIVE_USER_FAILURE';
export const CLEAR_UNARCHIVE_MESSAGE = 'CLEAR_UNARCHIVE_MESSAGE';

export const requestUnArchiveUser = () => {
  return { type: UNARCHIVE_USER_REQUEST };
};

export const successUnArchiveUser = (data: string) => {
  return { type: UNARCHIVE_USER_SUCCESS, message: data };
};

export const failureUnArchiveUser = (data: string) => {
  return { type: UNARCHIVE_USER_FAILURE, message: data };
};

export const clearUnArchiveMessage = () => ({ type: CLEAR_UNARCHIVE_MESSAGE });
