// @flow
export const LOGOUT_USER = 'LOGOUT_USER';

export const requestLogout = () => ({ type: LOGOUT_USER });

export const logoutUser = () => (dispatch: Function) => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('id');
  dispatch(requestLogout());
};
