// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import MainLogin from '../components/MainLogin';

type Props = {
  auth_info: Object,
  dispatch: Function,
  isAuthenticated: boolean,
  isFetching: boolean,
  message: string,
  verifyUserToken: Function
};

function Login(props: Props) {
  const { dispatch, isAuthenticated, message, isFetching } = props;

  return (
    <>
      {!isAuthenticated ? (
        <div className="container">
          <div className="row">
            <MainLogin
              dispatch={dispatch}
              isFetching={isFetching}
              message={message}
            />
          </div>
        </div>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { userAuth } = state;
  const { auth_info, isAuthenticated, message, isFetching } = userAuth;

  return { auth_info, isAuthenticated, message, isFetching };
}

export default connect(mapStateToProps)(Login);
