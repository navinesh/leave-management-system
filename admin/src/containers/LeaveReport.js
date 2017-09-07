// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import {
  fetchApprovedLeaveReport,
  fetchPendingLeaveReport,
  fetchCancelledRecord,
  fetchDeclinedRecord,
  fetchUserUpdates,
  fetchLeaveUpdates
} from '../actions/LeaveReport';

import LeaveReportList from '../components/LeaveReport';

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  isFetching: boolean,
  leave_record: Array<any>,
  approved_record: Array<any>,
  pending_record: Array<any>,
  cancelled_record: Array<any>,
  declined_record: Array<any>,
  user_updates: Array<any>,
  leave_updates: Array<any>,
  dispatch: Function
};

class LeaveReport extends Component<Props> {
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
      this.props.dispatch(fetchApprovedLeaveReport());
      this.props.dispatch(fetchPendingLeaveReport());
      this.props.dispatch(fetchCancelledRecord());
      this.props.dispatch(fetchDeclinedRecord());
      this.props.dispatch(fetchUserUpdates());
      this.props.dispatch(fetchLeaveUpdates());
    }
  }

  render() {
    const {
      isAuthenticated,
      isFetching,
      approved_record,
      pending_record,
      cancelled_record,
      declined_record,
      user_updates,
      leave_updates
    } = this.props;

    return (
      <div className="LeaveReport">
        {isAuthenticated
          ? isFetching
            ? <div className="text-center">
                <div className="loader1" />
              </div>
            : <LeaveReportList
                approved_record={approved_record}
                pending_record={pending_record}
                cancelled_record={cancelled_record}
                declined_record={declined_record}
                user_updates={user_updates}
                leave_updates={leave_updates}
              />
          : <Redirect to="/login" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    adminAuth,
    approvedLeaveReport,
    pendingLeaveReport,
    cancelledReport,
    declinedReport,
    userUpdates,
    leaveUpdates
  } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, approved_record } = approvedLeaveReport;
  const { pending_record } = pendingLeaveReport;
  const { cancelled_record } = cancelledReport;
  const { declined_record } = declinedReport;
  const { user_updates } = userUpdates;
  const { leave_updates } = leaveUpdates;

  return {
    auth_info,
    isAuthenticated,
    isFetching,
    approved_record,
    pending_record,
    cancelled_record,
    declined_record,
    user_updates,
    leave_updates
  };
};

export default connect(mapStateToProps)(LeaveReport);
