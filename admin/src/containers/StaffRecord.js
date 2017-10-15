// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { graphql, gql, compose } from 'react-apollo';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import StaffRecordList from '../components/StaffRecord';
import { submitModifyUserRecord } from '../actions/ModifyRecord';
import { submitArchiveUser } from '../actions/ArchiveUser';

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

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  activeUsers: Object,
  dispatch: Function,
  isFetching: boolean,
  message: string,
  isArchiveFetching: boolean,
  archiveMessage: string,
  isDataFetching: boolean
};

class StaffRecord extends Component<Props> {
  componentWillMount() {
    const { auth_info, dispatch } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token));
    }
  }

  render() {
    const {
      isAuthenticated,
      activeUsers: { loading, error, refetch, findUsers: staff_record },
      dispatch,
      isFetching,
      message,
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
            isArchiveFetching={isArchiveFetching}
            archiveMessage={archiveMessage}
            onModifyUserRecordSubmit={modifyUserDetails =>
              dispatch(submitModifyUserRecord(modifyUserDetails))}
            onArchiveUserSubmit={archiveUser =>
              dispatch(submitArchiveUser(archiveUser))}
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
  graphql(ACTIVE_USERS, {
    name: 'activeUsers'
  })
)(StaffRecord);
