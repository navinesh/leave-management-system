// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import UserChange from '../components/ChangePassword';
import {
  changePassword,
  clearChangePasswordError
} from '../actions/ChangePassword';

type Props = {
  auth_info: Object,
  dispatch: Function,
  isAuthenticated: boolean,
  message: string,
  isFetching: boolean
};

function UserChangePassword(props: Props) {
  useEffect(function() {
    return function() {
      dispatch(clearChangePasswordError());
    };
  }, []);

  const { dispatch, isAuthenticated, message, isFetching, auth_info } = props;

  return (
    <>
      {isAuthenticated ? (
        <UserChange
          dispatch={dispatch}
          isFetching={isFetching}
          message={message}
          auth_info={auth_info}
          onChangeClick={function(creds) {
            return dispatch(changePassword(creds));
          }}
        />
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { changePassword } = state;
  const { userAuth } = state;
  const { auth_info, isAuthenticated } = userAuth;
  const { isFetching, message } = changePassword;

  return { auth_info, isAuthenticated, isFetching, message };
}

export default connect(mapStateToProps)(UserChangePassword);
