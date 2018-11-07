// @flow
import React from 'react';
import { connect } from 'react-redux';

import { logoutAdmin } from '../actions/AdminLogout';
import Header from '../components/AdminHeader';

type Props = {
  isAuthenticated: boolean,
  dispatch: Function
};

function AdminHeader(props: Props) {
  const { isAuthenticated, dispatch } = props;

  return (
    <>
      {isAuthenticated && (
        <Header dispatch={dispatch} logoutAdmin={logoutAdmin} />
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { adminAuth } = state;
  const { isAuthenticated } = adminAuth;

  return { isAuthenticated };
}

export default connect(mapStateToProps)(AdminHeader);
