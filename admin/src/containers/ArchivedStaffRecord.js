import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { fetchArchivedStaffRecord } from "../actions/ArchivedStaffRecord";
import { clearSearchStaffRecord } from "../actions/StaffRecord";
import ArchivedStaffRecordList from "../components/ArchivedStaffRecord";
import { submitUnArchiveUser } from "../actions/UnArchiveUser";

class ArchivedStaffRecord extends Component {
  componentDidMount() {
    this.props.dispatch(fetchArchivedStaffRecord());
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
          : <Redirect to="/" />}
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

  const { isAuthenticated } = adminAuth;
  const { archived_staff_record } = archivedStaffRecord;
  const { searchTerm } = searchStaffRecord;
  const { isUnArchiveFetching, unArchiveMessage } = unArchiveUser;

  return {
    isAuthenticated,
    archived_staff_record,
    searchTerm,
    isUnArchiveFetching,
    unArchiveMessage
  };
};

export default connect(mapStateToProps)(ArchivedStaffRecord);
