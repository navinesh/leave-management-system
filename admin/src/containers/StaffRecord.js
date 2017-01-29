import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchStaffRecord,
  clearSearchStaffRecord
} from "../actions/StaffRecord";
import StaffRecordList from "../components/StaffRecord";

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
    const { staff_record, isAuthenticated, searchTerm, dispatch } = this.props;

    return (
      <div className="container">
        {
          isAuthenticated &&
            (
              <StaffRecordList
                staff_record={staff_record}
                searchTerm={searchTerm}
                dispatch={dispatch}
              />
            )
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { staffRecord, searchStaffRecord, adminAuth } = state;
  const { staff_record } = staffRecord;
  const { isAuthenticated } = adminAuth;
  const { searchTerm } = searchStaffRecord;

  return { staff_record, isAuthenticated, searchTerm };
};

export default connect(mapStateToProps)(StaffRecord);
