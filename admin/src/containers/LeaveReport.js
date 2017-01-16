import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchLeaveRecord } from "../actions/LeaveReport";
import LeaveReportList from "../components/LeaveReport";

const BeatLoader = require("halogen/BeatLoader");

class LeaveReport extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchLeaveRecord());
  }

  render() {
    const { isFetching, leave_record, isAuthenticated } = this.props;
    return (
      <div className="container">
        {isAuthenticated && (isFetching ? (
                <div className="text-center">
                  <BeatLoader color="#0275d8" size="12px" />
                </div>
              ) : <LeaveReportList leave_record={leave_record} />)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { leaveReport, adminAuth } = state;
  const { isFetching, leave_record } = leaveReport;
  const { isAuthenticated } = adminAuth;

  return { isFetching, leave_record, isAuthenticated };
};

export default connect(mapStateToProps)(LeaveReport)
