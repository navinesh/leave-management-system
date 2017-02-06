import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchStaffRecord,
  clearSearchStaffRecord
} from "../actions/StaffRecord";
import StaffRecordList from "../components/StaffRecord";
import { submitModifyUserRecord } from "../actions/ModifyRecord";
import { submitArchiveUser } from "../actions/ArchiveUser";

class StaffRecord extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchStaffRecord());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(clearSearchStaffRecord());
  }

  render() {
    const {
      staff_record,
      isAuthenticated,
      searchTerm,
      dispatch,
      isFetching,
      message,
      isArchiveFetching,
      archiveMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated &&
          <StaffRecordList
            staff_record={staff_record}
            searchTerm={searchTerm}
            dispatch={dispatch}
            isFetching={isFetching}
            message={message}
            isArchiveFetching={isArchiveFetching}
            archiveMessage={archiveMessage}
            onModifyUserRecordSubmit={modifyUserDetails =>
              dispatch(submitModifyUserRecord(modifyUserDetails))}
            onArchiveUserSubmit={archiveUser =>
              dispatch(submitArchiveUser(archiveUser))}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    staffRecord,
    searchStaffRecord,
    adminAuth,
    modifyUser,
    archiveUser
  } = state;
  const { staff_record } = staffRecord;
  const { isAuthenticated } = adminAuth;
  const { searchTerm } = searchStaffRecord;
  const { isFetching, message } = modifyUser;
  const { isArchiveFetching, archiveMessage } = archiveUser;

  return {
    staff_record,
    isAuthenticated,
    searchTerm,
    isFetching,
    message,
    isArchiveFetching,
    archiveMessage
  };
};

export default connect(mapStateToProps)(StaffRecord);
