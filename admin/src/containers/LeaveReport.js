import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { fetchLeaveRecord } from "../actions/LeaveReport";
import LeaveReportList from "../components/LeaveReport";

const BeatLoader = require("halogen/BeatLoader");

class LeaveReport extends Component {
  componentDidMount() {
    this.props.dispatch(fetchLeaveRecord());
  }

  render() {
    const { isAuthenticated, isFetching, leave_record } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? isFetching
              ? <div className="text-center">
                  <BeatLoader color="#0275d8" size="12px" />
                </div>
              : <LeaveReportList leave_record={leave_record} />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, leaveReport } = state;
  const { isAuthenticated } = adminAuth;
  const { isFetching, leave_record } = leaveReport;

  return { isAuthenticated, isFetching, leave_record };
};

export default connect(mapStateToProps)(LeaveReport);
