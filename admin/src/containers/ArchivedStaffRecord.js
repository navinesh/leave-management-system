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

const UNARCHIVE_USER = gql`
  mutation unArchiveUser($userId: Int!) {
    unArchiveUser(userId: $userId) {
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
  verifyAdminToken: Function,
  dispatch: Function,
  archivedUsers: Object,
  unArchiveUser: Function
};

class ArchivedStaffRecord extends Component<Props> {
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
      archivedUsers: { loading, error, findUsers, refetch },
      dispatch,
      unArchiveUser
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
          <ArchivedStaffRecordList
            archived_staff_record={findUsers}
            dispatch={dispatch}
            unArchiveUser={unArchiveUser}
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
  }),
  graphql(ARCHIVED_USERS, { name: 'archivedUsers' }),
  graphql(UNARCHIVE_USER, {
    name: 'unArchiveUser',
    props: ({ unArchiveUser }) => ({
      unArchiveUser: userId => unArchiveUser({ variables: { userId } })
    })
  })
)(ArchivedStaffRecord);
