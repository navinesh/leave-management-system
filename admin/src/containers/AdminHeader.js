// @flow
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { logoutAdmin } from '../actions/AdminLogout';
import Header from '../components/AdminHeader';

type Props = {
  isAuthenticated: boolean,
  dispatch: Function
};

function AdminHeader(props: Props) {
  return (
    <Fragment>
      {props.isAuthenticated && (
        <Header dispatch={props.dispatch} logoutAdmin={logoutAdmin} />
      )}
    </Fragment>
  );
}

function mapStateToProps(state) {
  const { adminAuth } = state;
  const { isAuthenticated } = adminAuth;

  return { isAuthenticated };
}

export default connect(mapStateToProps)(AdminHeader);
