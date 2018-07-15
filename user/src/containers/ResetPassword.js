// @flow
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import UserResetPassword from '../components/ResetPassword';
import { resetPassword } from '../actions/ResetPassword';

type Props = {
  dispatch: Function,
  isAuthenticated: boolean,
  message: string,
  isFetching: boolean,
  dispatch: Function
};

const ResetPassword = (props: Props) => (
  <Fragment>
    {!props.isAuthenticated ? (
      <UserResetPassword
        isFetching={props.isFetching}
        message={props.message}
        dispatch={props.dispatch}
        onResetClick={email => props.dispatch(resetPassword(email))}
      />
    ) : (
      <Redirect to="/" />
    )}
  </Fragment>
);

const mapStateToProps = state => {
  const { userAuth, resetPassword } = state;

  const { isAuthenticated } = userAuth;
  const { isFetching, message } = resetPassword;

  return { isAuthenticated, isFetching, message };
};

export default connect(mapStateToProps)(ResetPassword);
