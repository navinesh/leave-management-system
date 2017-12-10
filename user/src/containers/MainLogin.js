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

const Login = (props: Props) => (
  <div className="Main">
    {!props.isAuthenticated ? (
      <div className="container">
        <div className="row">
          <MainLogin
            dispatch={props.dispatch}
            isFetching={props.isFetching}
            message={props.message}
          />
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    )}
  </div>
);

const mapStateToProps = state => {
  const { userAuth } = state;
  const { auth_info, isAuthenticated, message, isFetching } = userAuth;

  return { auth_info, isAuthenticated, message, isFetching };
};

export default connect(mapStateToProps)(Login);
