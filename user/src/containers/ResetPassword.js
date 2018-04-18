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
  isFetching: boolean
};

const ResetPassword = (props: Props) => (
  <Fragment>
    {!props.isAuthenticated ? (
      <UserResetPassword
        isFetching={props.isFetching}
        message={props.message}
        onResetClick={email => props.dispatch(resetPassword(email))}
      />
    ) : (
      <Redirect to="/" />
    )}
  </Fragment>
);

const mapStateToProps = state => {
  const { userAuth } = state;
  const { isAuthenticated, isFetching } = userAuth;

  return { isAuthenticated, isFetching };
};

export default connect(mapStateToProps)(ResetPassword);
