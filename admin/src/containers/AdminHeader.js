// @flow
import React from 'react';
import { connect } from 'react-redux';

import Header from '../components/AdminHeader';

type Props = {
  isAuthenticated: boolean,
  dispatch: Function
};

const AdminHeader = (props: Props) => (
  <div className="AdminHeader">
    {props.isAuthenticated && <Header dispatch={props.dispatch} />}
  </div>
);

const mapStateToProps = state => {
  const { adminAuth } = state;
  const { isAuthenticated } = adminAuth;

  return { isAuthenticated };
};

export default connect(mapStateToProps)(AdminHeader);
