// @flow
import axios from 'axios';

export const REQUEST_USER_DETAILS = 'REQUEST_USER_DETAILS';
export const RECEIVE_USER_DETAILS = 'RECEIVE_USER_DETAILS';
export const USER_DETAILS_ERROR = 'USER_DETAILS_ERROR';
export const CLEAR_USER_DETAILS = 'CLEAR_USER_DETAILS';

export const requestUserDetails = (auth_token: string) => ({
  type: REQUEST_USER_DETAILS,
  auth_token
});

export const userDetailsError = (data: Object) => ({
  type: USER_DETAILS_ERROR,
  message: data.message
});

export const receiveUserDetails = (data: Object) => ({
  type: RECEIVE_USER_DETAILS,
  user_detail: data.user_detail
});

export const clearUserDetails = () => ({ type: CLEAR_USER_DETAILS });

export const fetchUserDetails = (auth_token: string) => async (
  dispatch: Function
) => {
  try {
    dispatch(requestUserDetails(auth_token));
    const response = await axios({
      url: 'http://localhost:8080/user-detail.api',
      auth: { username: auth_token }
    });

    if (response.status !== 201) {
      dispatch(userDetailsError(response.data));
    } else {
      dispatch(receiveUserDetails(response.data));
    }
  } catch (error) {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'LOGIN_FAILURE_FROM_TOKEN' });
    dispatch({ type: 'CLEAR_USER_RECORD' });
    dispatch({ type: 'CLEAR_USER_DETAILS' });
  }
};

export const shouldfetchUserDetails = (
  state: Object,
  userDetails?: Array<any>
) => {
  const userState = state.userDetails;
  const { userDetail } = userState;
  const details = Object.keys(userDetail).length;

  if (!details) {
    return true;
  } else if (userState.isFetching) {
    return false;
  }
};

export const fetchUserDetailsIfNeeded = (auth_token: string) => (
  dispatch: Function,
  getState: Function
) => {
  if (shouldfetchUserDetails(getState())) {
    // Dispatch a thunk from thunk!
    return dispatch(fetchUserDetails(auth_token));
  } else {
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve();
  }
};
