// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql, compose, Query } from 'react-apollo';

import {
  requestAdminLoginFromToken,
  receiveAdminLoginFromToken,
  loginAdminErrorFromToken
} from '../actions/AdminLogin';
import ArchivedStaffRecordList from '../components/ArchivedStaffRecord';

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      token
      ok
    }
  }
`;

const ARCHIVED_USERS = gql`
  {
    findUsers(isArchived: "true") {
      id
      dbId
      othernames
      surname
      email
      annual
      sick
      christmas
      bereavement
      dateOfBirth
      maternity
      gender
    }
  }
`;

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  verifyAdminToken: Function,
  archivedUsers: Object
};

class ArchivedStaffRecord extends Component<Props> {
  componentDidMount() {
    this.verifyToken();
  }

  verifyToken = async () => {
    const { auth_info, dispatch, verifyAdminToken } = this.props;

    const adminToken = auth_info.admin_token
      ? auth_info.admin_token
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
        dispatch(loginAdminErrorFromToken('Your session has expired!'));
      }
    }
  };

  render() {
    const { isAuthenticated } = this.props;

    return (
      <div className="container">
        {isAuthenticated ? (
          <Query query={ARCHIVED_USERS}>
            {({
              loading,
              error,
              data: { findUsers: staff_record },
              refetch
            }) => {
              if (loading) {
                return (
                  <div className="text-center">
                    <div className="loader1" />
                  </div>
                );
              }

              if (error) {
                console.log(error);
                return (
                  <div className="text-center">
                    <p>Something went wrong!</p>
                  </div>
                );
              }

              return (
                <ArchivedStaffRecordList
                  archived_staff_record={staff_record}
                  refetch={refetch}
                />
              );
            }}
          </Query>
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth } = state;

  const { auth_info, isAuthenticated } = adminAuth;

  return { auth_info, isAuthenticated };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  })
)(ArchivedStaffRecord);
