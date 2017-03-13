import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import {
  fetchStaffRecord,
  clearSearchStaffRecord
} from "../actions/StaffRecord";
import StaffRecordList from "../components/StaffRecord";
import { submitModifyUserRecord } from "../actions/ModifyRecord";
import { submitArchiveUser } from "../actions/ArchiveUser";

class StaffRecord extends Component {
  componentDidMount() {
    this.props.dispatch(fetchStaffRecord());
  }

  componentWillUnmount() {
    this.props.dispatch(clearSearchStaffRecord());
  }

  render() {
    const {
      isAuthenticated,
      staff_record,
      searchTerm,
      dispatch,
      isFetching,
      message,
      isArchiveFetching,
      archiveMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? <StaffRecordList
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
            />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    adminAuth,
    staffRecord,
    searchStaffRecord,
    modifyUser,
    archiveUser
  } = state;

  const { isAuthenticated } = adminAuth;
  const { staff_record } = staffRecord;
  const { searchTerm } = searchStaffRecord;
  const { isFetching, message } = modifyUser;
  const { isArchiveFetching, archiveMessage } = archiveUser;

  return {
    isAuthenticated,
    staff_record,
    searchTerm,
    isFetching,
    message,
    isArchiveFetching,
    archiveMessage
  };
};

export default connect(mapStateToProps)(StaffRecord);
