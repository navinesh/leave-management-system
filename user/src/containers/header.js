// @flow
import React from 'react';
import { connect } from 'react-redux';

import Navs from '../components/Header';

const Header = ({ isAuthenticated, dispatch }) => (
  <div className="Header">
    <Navs isAuthenticated={isAuthenticated} dispatch={dispatch} />
  </div>
);

const mapStateToProps = state => {
  const { userAuth } = state;
  const { isAuthenticated } = userAuth;

  return { isAuthenticated };
};

export default connect(mapStateToProps)(Header);
