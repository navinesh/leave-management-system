// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import '../spinners.css';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import { fetchLeaveRecord } from '../actions/LeaveReport';
import LeaveReportList from '../components/LeaveReport';

class LeaveReport extends Component {
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
      const { dispatch } = this.props;
      dispatch(fetchLeaveRecord());
    }
  }

  render() {
    const { isAuthenticated, isFetching, leave_record } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? isFetching
            ? <div className="text-center">
                <div className="loader1" />
              </div>
            : <LeaveReportList leave_record={leave_record} />
          : <Redirect to="/login" />}
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
