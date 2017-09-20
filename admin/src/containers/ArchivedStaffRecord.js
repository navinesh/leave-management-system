// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import { fetchArchivedStaffRecord } from '../actions/ArchivedStaffRecord';
import ArchivedStaffRecordList from '../components/ArchivedStaffRecord';
import { submitUnArchiveUser } from '../actions/UnArchiveUser';

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  archived_staff_record: Array<any>,
  dispatch: Function,
  isUnArchiveFetching: boolean,
  unArchiveMessage: string,
  isDataFetching: boolean
};

class ArchivedStaffRecord extends Component<Props> {
  componentWillMount() {
    const { dispatch, auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token));
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.dispatch(fetchArchivedStaffRecord());
    }
  }

  render() {
    const {
      isAuthenticated,
      archived_staff_record,
      dispatch,
      isUnArchiveFetching,
      unArchiveMessage,
      isDataFetching
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated ? (
          isDataFetching ? (
            <div className="text-center">
              <div className="loader1" />
            </div>
          ) : (
            <ArchivedStaffRecordList
              archived_staff_record={archived_staff_record}
              dispatch={dispatch}
              isUnArchiveFetching={isUnArchiveFetching}
              unArchiveMessage={unArchiveMessage}
              onUnArchiveUserSubmit={unArchiveUser =>
                dispatch(submitUnArchiveUser(unArchiveUser))}
              fetchArchivedStaffRecord={fetchArchivedStaffRecord}
            />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, archivedStaffRecord, unArchiveUser } = state;

  const { auth_info, isAuthenticated } = adminAuth;
  const {
    archived_staff_record,
    isFetching: isDataFetching
  } = archivedStaffRecord;
  const { isUnArchiveFetching, unArchiveMessage } = unArchiveUser;

  return {
    auth_info,
    isAuthenticated,
    archived_staff_record,
    isUnArchiveFetching,
    unArchiveMessage,
    isDataFetching
  };
};

export default connect(mapStateToProps)(ArchivedStaffRecord);
