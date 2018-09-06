// @flow
export const LOGOUT_ADMIN_REQUEST = 'LOGOUT_ADMIN_REQUEST';
export const LOGOUT_ADMIN_SUCCESS = 'LOGOUT_ADMIN_SUCCESS';

export function requestLogout() {
  return {
    type: LOGOUT_ADMIN_REQUEST
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_ADMIN_SUCCESS
  };
}

export function logoutAdmin() {
  return function(dispatch: Function) {
    dispatch(requestLogout());
    dispatch(receiveLogout());
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };
}
