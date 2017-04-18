// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { fetchLoginFromToken } from "../actions/AdminLogin";
import { fetchLeaveRecord } from "../actions/LeaveReport";
import LeaveReportList from "../components/LeaveReport";

class LeaveReport extends Component {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem("admin_token");

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token, fetchLeaveRecord));
    }
  }

  render() {
    const { isAuthenticated, isFetching, leave_record } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? isFetching
              ? <div className="text-center">
                  <div>Loading...</div>
                </div>
              : <LeaveReportList leave_record={leave_record} />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, leaveReport } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, leave_record } = leaveReport;

  return { auth_info, isAuthenticated, isFetching, leave_record };
};

export default connect(mapStateToProps)(LeaveReport);
