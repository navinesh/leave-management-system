// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import PublicHolidays from '../components/PublicHoliday';

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  dispatch: Function
};

class PublicHoliday extends Component<Props> {
  componentWillMount() {
    const { dispatch, auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token));
    }
  }

  render() {
    const { isAuthenticated } = this.props;

    return (
      <div className="container">
        {isAuthenticated ? <PublicHolidays /> : <Redirect to="/login" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth } = state;
  const { auth_info, isAuthenticated } = adminAuth;

  return {
    auth_info,
    isAuthenticated
  };
};

export default connect(mapStateToProps)(PublicHoliday);
