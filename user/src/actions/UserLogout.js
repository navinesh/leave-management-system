// @flow
export const LOGOUT_USER = 'LOGOUT_USER';

export function requestLogout() {
  return { type: LOGOUT_USER };
}

export function logoutUser() {
  return (dispatch: Function) => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('id');
    dispatch(requestLogout());
  };
}
