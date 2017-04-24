// @flow
import React from 'react';
import { connect } from 'react-redux';

import Header from '../components/AdminHeader';

const AdminHeader = ({ isAuthenticated, dispatch }) => (
  <div className="AdminHeader">
    {isAuthenticated && <Header dispatch={dispatch} />}
  </div>
);

const mapStateToProps = state => {
  const { adminAuth } = state;
  const { isAuthenticated } = adminAuth;

  return { isAuthenticated };
};

export default connect(mapStateToProps)(AdminHeader);
