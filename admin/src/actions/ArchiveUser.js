// @flow
export const ARCHIVE_USER_REQUEST = 'ARCHIVE_USER_REQUEST';
export const ARCHIVE_USER_SUCCESS = 'ARCHIVE_USER_SUCCESS';
export const ARCHIVE_USER_FAILURE = 'ARCHIVE_USER_FAILURE';
export const CLEAR_ARCHIVE_MESSAGE = 'CLEAR_ARCHIVE_MESSAGE';

export const requestArchiveUser = () => {
  return { type: ARCHIVE_USER_REQUEST };
};

export const successArchiveUser = (data: string) => {
  return { type: ARCHIVE_USER_SUCCESS, message: data };
};

export const failureArchiveUser = (data: string) => {
  return { type: ARCHIVE_USER_FAILURE, message: data };
};

export const clearArchiveMessage = () => ({ type: CLEAR_ARCHIVE_MESSAGE });
