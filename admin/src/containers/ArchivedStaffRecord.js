import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchArchivedStaffRecord } from "../actions/ArchivedStaffRecord";
import { clearSearchStaffRecord } from "../actions/StaffRecord";
import ArchivedStaffRecordList from "../components/ArchivedStaffRecord";
import { submitUnArchiveUser } from "../actions/UnArchiveUser";

class ArchivedStaffRecord extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchArchivedStaffRecord());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(clearSearchStaffRecord());
  }

  render() {
    const {
      archived_staff_record,
      isAuthenticated,
      searchTerm,
      dispatch,
      isUnArchiveFetching,
      unArchiveMessage
    } = this.props;
    return (
      <div className="container">
        {isAuthenticated &&
          <ArchivedStaffRecordList
            archived_staff_record={archived_staff_record}
            searchTerm={searchTerm}
            dispatch={dispatch}
            isUnArchiveFetching={isUnArchiveFetching}
            unArchiveMessage={unArchiveMessage}
            onUnArchiveUserSubmit={unArchiveUser =>
              dispatch(submitUnArchiveUser(unArchiveUser))}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    archivedStaffRecord,
    searchStaffRecord,
    adminAuth,
    unArchiveUser
  } = state;
  const { archived_staff_record } = archivedStaffRecord;
  const { isAuthenticated } = adminAuth;
  const { searchTerm } = searchStaffRecord;
  const { isUnArchiveFetching, unArchiveMessage } = unArchiveUser;

  return {
    archived_staff_record,
    isAuthenticated,
    searchTerm,
    isUnArchiveFetching,
    unArchiveMessage
  };
};

export default connect(mapStateToProps)(ArchivedStaffRecord);
