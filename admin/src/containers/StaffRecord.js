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
import StaffRecordList from '../components/StaffRecord';
import { submitModifyUserRecord } from '../actions/ModifyRecord';

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      token
      ok
    }
  }
`;

const ACTIVE_USERS = gql`
  {
    findUsers(isArchived: "false") {
      id
      dbId
      othernames
      surname
      email
      annual
      sick
      christmas
      bereavement
      familyCare
      dateOfBirth
      maternity
      paternity
      gender
      designation
    }
  }
`;

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  dispatch: Function,
  isFetching: boolean,
  message: string,
  verifyAdminToken: Function,
  archiveUser: Function,
  isArchiveFetching: boolean,
  archiveMessage: string
};

class StaffRecord extends Component<Props> {
  componentDidMount() {
    this.verifyToken();
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
    const { isAuthenticated, dispatch, isFetching, message } = this.props;

    return (
      <div className="container">
        {isAuthenticated ? (
          <Query query={ACTIVE_USERS}>
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
                <StaffRecordList
                  staff_record={staff_record}
                  dispatch={dispatch}
                  isFetching={isFetching}
                  message={message}
                  onModifyUserRecordSubmit={modifyUserDetails =>
                    dispatch(submitModifyUserRecord(modifyUserDetails))
                  }
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
  const { adminAuth, modifyUser } = state;

  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, message } = modifyUser;

  return {
    auth_info,
    isAuthenticated,
    isFetching,
    message
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  })
)(StaffRecord);
