// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import {
  requestAdminLoginFromToken,
  receiveAdminLoginFromToken,
  loginAdminErrorFromToken
} from '../actions/AdminLogin';
import PublicHolidays from '../components/PublicHoliday';

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      token
      ok
    }
  }
`;

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  dispatch: Function,
  verifyAdminToken: Function
};

class PublicHoliday extends Component<Props> {
  componentWillMount() {
    const { auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      this.verifyToken();
    }
  }

  verifyToken = async () => {
    const { dispatch, verifyAdminToken } = this.props;
    const adminToken = localStorage.getItem('admin_token');

    try {
      dispatch(requestAdminLoginFromToken());
      const response = await verifyAdminToken({
        variables: { adminToken }
      });
      dispatch(
        receiveAdminLoginFromToken(response.data.verifyAdminToken.token)
      );
    } catch (error) {
      console.log(error);
      localStorage.removeItem('admin_token');
      dispatch(loginAdminErrorFromToken('Your session has expired!'));
    }
  };

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

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  })
)(PublicHoliday);
