// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import {
  requestAdminLoginFromToken,
  receiveAdminLoginFromToken,
  loginAdminErrorFromToken
} from '../actions/AdminLogin';
import LeaveReportList from '../components/LeaveReport';

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      token
      ok
    }
  }
`;

const APPROVED_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "approved", isArchived: "false") {
      id
      userId
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveStatus
      leaveReason
      datePosted
      dateReviewed
      user {
        othernames
        surname
      }
    }
  }
`;

const PENDING_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "pending", isArchived: "false") {
      id
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveStatus
      leaveReason
      datePosted
      dateReviewed
      user {
        othernames
        surname
      }
    }
  }
`;

const CANCELLED_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "cancelled", isArchived: "false") {
      id
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveStatus
      cancelledReason
      datePosted
      dateReviewed
      user {
        othernames
        surname
      }
    }
  }
`;

const DECLINED_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "declined", isArchived: "false") {
      id
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveStatus
      declinedReason
      datePosted
      dateReviewed
      user {
        othernames
        surname
      }
    }
  }
`;

const USER_UPDATES_RECORD = gql`
  {
    findUserUpdates(isArchived: "false") {
      id
      userId
      annual
      sick
      bereavement
      christmas
      maternity
      designation
      dateOfBirth
      gender
      editReason
      datePosted
      user {
        othernames
        surname
      }
    }
  }
`;

const LEAVE_UPDATES_RECORD = gql`
  {
    findLeaveUpdates(isArchived: "false") {
      id
      leaveId
      previousStartDate
      previousEndDate
      previousLeaveName
      previousLeaveDays
      updatedStartDate
      updatedEndDate
      updatedLeaveName
      updatedLeaveDays
      editReason
      datePosted
      leaverecord {
        user {
          othernames
          surname
        }
      }
    }
  }
`;

const ACTIVE_USERS = gql`
  {
    findUsers(isArchived: "false") {
      id
      othernames
      surname
      annual
      sick
      christmas
      bereavement
      maternity
    }
  }
`;

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  approvedRecord: Object,
  pendingRecord: Object,
  cancelledRecord: Object,
  declinedRecord: Object,
  userUpdates: Object,
  leaveUpdates: Object,
  activeUsers: Object,
  dispatch: Function,
  verifyAdminToken: Function
};

class LeaveReport extends Component<Props> {
  componentWillMount() {
    this.verifyToken();
  }

  verifyToken = async () => {
    const { auth_info, dispatch, verifyAdminToken } = this.props;

    const adminToken = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (adminToken) {
      try {
        dispatch(requestAdminLoginFromToken());
        const response = await verifyAdminToken({
          variables: { adminToken }
        });
        dispatch(
          receiveAdminLoginFromToken(response.data.verifyAdminToken.token)
        );
      } catch (error) {
        console.log(error);
        localStorage.removeItem('admin_token');
        dispatch(loginAdminErrorFromToken('Your session has expired!'));
      }
    }
  };

  render() {
    const {
      isAuthenticated,
      approvedRecord: {
        loading: approvedLoading,
        error: approvedError,
        findLeaveRecord: approved_record
      },
      pendingRecord: {
        loading: pendingLoading,
        error: pendingError,
        findLeaveRecord: pending_record
      },
      cancelledRecord: {
        loading: cancelledLoading,
        error: cancelledError,
        findLeaveRecord: cancelled_record
      },
      declinedRecord: {
        loading: declinedLoading,
        error: declinedError,
        findLeaveRecord: declined_record
      },
      userUpdates: {
        loading: userLoading,
        error: userError,
        findUserUpdates: user_updates
      },
      leaveUpdates: {
        loading: leaveLoading,
        error: leaveError,
        findLeaveUpdates: leave_updates
      },
      activeUsers: {
        loading: activeUsersLoading,
        error: activeUsersError,
        findUsers: staff_record
      }
    } = this.props;

    if (
      approvedLoading ||
      pendingLoading ||
      cancelledLoading ||
      declinedLoading ||
      userLoading ||
      leaveLoading ||
      activeUsersLoading
    ) {
      return (
        <div className="text-center">
          <div className="loader1" />
        </div>
      );
    }

    if (
      approvedError ||
      pendingError ||
      cancelledError ||
      declinedError ||
      userError ||
      leaveError ||
      activeUsersError
    ) {
      console.log(
        approvedError ||
          pendingError ||
          cancelledError ||
          declinedError ||
          userError ||
          leaveError ||
          activeUsersError
      );
      return (
        <div className="text-center">
          <p>Something went wrong!</p>
        </div>
      );
    }

    return (
      <div className="LeaveReport">
        {isAuthenticated ? (
          <LeaveReportList
            approved_record={approved_record}
            pending_record={pending_record}
            cancelled_record={cancelled_record}
            declined_record={declined_record}
            user_updates={user_updates}
            leave_updates={leave_updates}
            staff_record={staff_record}
          />
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth } = state;
  const { auth_info, isAuthenticated } = adminAuth;

  return { auth_info, isAuthenticated };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken',
    options: { pollInterval: 60000 }
  }),
  graphql(APPROVED_RECORD, {
    name: 'approvedRecord',
    options: { pollInterval: 60000 }
  }),
  graphql(PENDING_RECORD, {
    name: 'pendingRecord',
    options: { pollInterval: 60000 }
  }),
  graphql(CANCELLED_RECORD, {
    name: 'cancelledRecord',
    options: { pollInterval: 60000 }
  }),
  graphql(DECLINED_RECORD, {
    name: 'declinedRecord',
    options: { pollInterval: 60000 }
  }),
  graphql(USER_UPDATES_RECORD, {
    name: 'userUpdates',
    options: { pollInterval: 60000 }
  }),
  graphql(LEAVE_UPDATES_RECORD, {
    name: 'leaveUpdates',
    options: { pollInterval: 60000 }
  }),
  graphql(ACTIVE_USERS, {
    name: 'activeUsers',
    options: { pollInterval: 60000 }
  })
)(LeaveReport);
