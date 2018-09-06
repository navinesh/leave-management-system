// @flow
import React from 'react';
import { connect } from 'react-redux';

import AdminResetPassword from '../components/AdminResetPassword';
import { resetPassword } from '../actions/AdminResetPassword';

type Props = {
  dispatch: Function,
  isFetching: boolean,
  message: string
};

const ResetPassword = (props: Props) => (
  <AdminResetPassword
    isFetching={props.isFetching}
    message={props.message}
    onResetClick={email => props.dispatch(resetPassword(email))}
  />
);

const mapStateToProps = state => {
  const { resetPassword } = state;
  const { isFetching, message } = resetPassword;

  return { isFetching, message };
};

export default connect(mapStateToProps)(ResetPassword);
