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
      dateOfBirth
      maternity
      gender
    }
  }
`;

const ARCHIVE_USER = gql`
  mutation archiveUser($id: String!, $archiveReason: String!) {
    archiveUser(id: $id, archiveReason: $archiveReason) {
      User {
        isArchived
      }
      ok
    }
  }
`;

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  activeUsers: Object,
  dispatch: Function,
  isFetching: boolean,
  message: string,
  verifyAdminToken: Function,
  archiveUser: Function,
  isArchiveFetching: boolean,
  archiveMessage: string
};

class StaffRecord extends Component<Props> {
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
    const {
      isAuthenticated,
      activeUsers: { loading, error, refetch, findUsers: staff_record },
      dispatch,
      isFetching,
      message,
      archiveUser,
      isArchiveFetching,
      archiveMessage
    } = this.props;

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
      <div className="container">
        {isAuthenticated ? (
          <StaffRecordList
            staff_record={staff_record}
            dispatch={dispatch}
            isFetching={isFetching}
            message={message}
            onModifyUserRecordSubmit={modifyUserDetails =>
              dispatch(submitModifyUserRecord(modifyUserDetails))}
            archiveUser={archiveUser}
            isArchiveFetching={isArchiveFetching}
            archiveMessage={archiveMessage}
            refetch={refetch}
          />
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, modifyUser, archiveUser } = state;

  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, message } = modifyUser;
  const { isArchiveFetching, archiveMessage } = archiveUser;

  return {
    auth_info,
    isAuthenticated,
    isFetching,
    message,
    isArchiveFetching,
    archiveMessage
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  }),
  graphql(ACTIVE_USERS, {
    name: 'activeUsers'
  }),
  graphql(ARCHIVE_USER, {
    name: 'archiveUser'
  })
)(StaffRecord);
