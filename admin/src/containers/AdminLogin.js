// @flow
import React from 'react';
import { connect } from 'react-redux';

import { fetchLogin } from '../actions/AdminLogin';
import Login from '../components/AdminLogin';
import { Redirect } from 'react-router-dom';

const AdminLogin = ({ dispatch, message, isAuthenticated, isFetching }) => (
  <div className="AdminLogin">
    {!isAuthenticated
      ? <div>
          <h1 className="display-4 text-center pb-4">
            Leave Management System
          </h1>
          <Login
            isFetching={isFetching}
            message={message}
            onLoginClick={creds => dispatch(fetchLogin(creds))}
          />
        </div>
      : <Redirect to="/" />}
  </div>
);

const mapStateToProps = state => {
  const { adminAuth } = state;
  const { isAuthenticated, message, isFetching } = adminAuth;

  return { message, isAuthenticated, isFetching };
};

export default connect(mapStateToProps)(AdminLogin);
