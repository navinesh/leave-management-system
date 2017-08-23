import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import { fetchArchivedStaffRecord } from '../actions/ArchivedStaffRecord';
import { clearSearchStaffRecord } from '../actions/StaffRecord';
import ArchivedStaffRecordList from '../components/ArchivedStaffRecord';
import { submitUnArchiveUser } from '../actions/UnArchiveUser';

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  archived_staff_record: Array<any>,
  searchTerm: string,
  dispatch: Function,
  isUnArchiveFetching: boolean,
  unArchiveMessage: string
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

  componentWillUnmount() {
    this.props.dispatch(clearSearchStaffRecord());
  }

  render() {
    const {
      isAuthenticated,
      archived_staff_record,
      searchTerm,
      dispatch,
      isUnArchiveFetching,
      unArchiveMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? <ArchivedStaffRecordList
              archived_staff_record={archived_staff_record}
              searchTerm={searchTerm}
              dispatch={dispatch}
              isUnArchiveFetching={isUnArchiveFetching}
              unArchiveMessage={unArchiveMessage}
              onUnArchiveUserSubmit={unArchiveUser =>
                dispatch(submitUnArchiveUser(unArchiveUser))}
            />
          : <Redirect to="/login" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    adminAuth,
    archivedStaffRecord,
    searchStaffRecord,
    unArchiveUser
  } = state;

  const { auth_info, isAuthenticated } = adminAuth;
  const { archived_staff_record } = archivedStaffRecord;
  const { searchTerm } = searchStaffRecord;
  const { isUnArchiveFetching, unArchiveMessage } = unArchiveUser;

  return {
    auth_info,
    isAuthenticated,
    archived_staff_record,
    searchTerm,
    isUnArchiveFetching,
    unArchiveMessage
  };
};

export default connect(mapStateToProps)(ArchivedStaffRecord);
