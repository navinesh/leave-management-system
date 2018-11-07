// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Login from '../components/AdminLogin';

type Props = {
  isFetching: boolean,
  message: string,
  isAuthenticated: boolean,
  dispatch: Function
};

function AdminLogin(props: Props) {
  const { isAuthenticated, dispatch, isFetching, message } = props;

  return (
    <>
      {!isAuthenticated ? (
        <Login isFetching={isFetching} message={message} dispatch={dispatch} />
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { adminAuth } = state;
  const { isFetching, message, isAuthenticated } = adminAuth;

  return { isFetching, message, isAuthenticated };
}

export default connect(mapStateToProps)(AdminLogin);
