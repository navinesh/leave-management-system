// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import UserChange from '../components/ChangePassword';
import {
  changePassword,
  clearChangePasswordError
} from '../actions/ChangePassword';

type Props = {
  auth_info: Object,
  dispatch: Function,
  message: string,
  isFetching: boolean
};

function UserChangePassword(props: Props) {
  useEffect(function() {
    return function() {
      dispatch(clearChangePasswordError());
    };
  }, []);

  const { dispatch, message, isFetching, auth_info } = props;

  return (
    <UserChange
      dispatch={dispatch}
      isFetching={isFetching}
      message={message}
      auth_info={auth_info}
      onChangeClick={function(creds) {
        return dispatch(changePassword(creds));
      }}
    />
  );
}

function mapStateToProps(state) {
  const { changePassword } = state;
  const { userAuth } = state;
  const { auth_info } = userAuth;
  const { isFetching, message } = changePassword;

  return { auth_info, isFetching, message };
}

export default connect(mapStateToProps)(UserChangePassword);
