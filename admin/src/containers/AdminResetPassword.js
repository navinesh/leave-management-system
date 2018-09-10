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

function ResetPassword(props: Props) {
  return (
    <AdminResetPassword
      isFetching={props.isFetching}
      message={props.message}
      onResetClick={function(email) {
        return props.dispatch(resetPassword(email));
      }}
    />
  );
}

function mapStateToProps(state) {
  const { resetPassword } = state;
  const { isFetching, message } = resetPassword;

  return { isFetching, message };
}

export default connect(mapStateToProps)(ResetPassword);
