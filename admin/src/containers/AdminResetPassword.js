// @flow
import React from 'react';
import { connect } from 'react-redux';

import AdminResetPassword from '../components/AdminResetPassword';
import { resetPassword } from '../actions/AdminResetPassword';

const ResetPassword = ({ dispatch, message, isFetching }) =>
  <div className="ResetPassword">
    <AdminResetPassword
      isFetching={isFetching}
      message={message}
      onResetClick={email => dispatch(resetPassword(email))}
    />
  </div>;

const mapStateToProps = state => {
  const { resetPassword } = state;
  const { isFetching, message } = resetPassword;

  return { isFetching, message };
};

export default connect(mapStateToProps)(ResetPassword);
