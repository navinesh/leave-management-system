// @flow
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { logoutUser } from '../actions/UserLogout';
import Navs from '../components/Header';

type Props = {
  isAuthenticated: boolean,
  dispatch: Function
};

const Header = (props: Props) => (
  <Fragment>
    <Navs
      isAuthenticated={props.isAuthenticated}
      dispatch={props.dispatch}
      logoutUser={logoutUser}
    />
  </Fragment>
);

const mapStateToProps = state => {
  const { userAuth } = state;
  const { isAuthenticated } = userAuth;

  return { isAuthenticated };
};

export default connect(mapStateToProps)(Header);
