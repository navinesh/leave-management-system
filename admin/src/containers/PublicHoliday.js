// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
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
  componentDidMount() {
    this.verifyToken();
    setInterval(this.verifyToken, 600000);
  }

  verifyToken = async () => {
    const { auth_info, dispatch, verifyAdminToken } = this.props;

    const adminToken = auth_info.admin_token
      ? auth_info
      : localStorage.getItem('admin_token');

    if (adminToken) {
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
        localStorage.removeItem('admin_user');
        dispatch(loginAdminErrorFromToken('Your session has expired!'));
      }
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
