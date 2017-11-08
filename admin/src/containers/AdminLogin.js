// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchLogin } from '../actions/AdminLogin';
import Login from '../components/AdminLogin';

type Props = {
  isAuthenticated: boolean,
  isFetching: boolean,
  dispatch: Function,
  message: string
};

const AdminLogin = (props: Props) => (
  <div className="AdminLogin">
    {!props.isAuthenticated ? (
      <Login
        isFetching={props.isFetching}
        message={props.message}
        dispatch={props.dispatch}
        onLoginClick={creds => props.dispatch(fetchLogin(creds))}
      />
    ) : (
      <Redirect to="/" />
    )}
  </div>
);

const mapStateToProps = state => {
  const { adminAuth } = state;
  const { isAuthenticated, message, isFetching } = adminAuth;

  return { message, isAuthenticated, isFetching };
};

export default connect(mapStateToProps)(AdminLogin);
