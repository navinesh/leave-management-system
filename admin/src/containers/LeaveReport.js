// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { graphql, gql, compose } from 'react-apollo';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import LeaveReportList from '../components/LeaveReport';

const APPROVED_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "approved") {
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
    findLeaveRecord(leaveStatus: "pending") {
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
    findLeaveRecord(leaveStatus: "cancelled") {
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
    findLeaveRecord(leaveStatus: "declined") {
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
    userUpdates {
      edges {
        node {
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
    }
  }
`;

const LEAVE_UPDATES_RECORD = gql`
  {
    leaveUpdates {
      edges {
        node {
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
        userUpdates: user_updates
      },
      leaveUpdates: {
        loading: leaveLoading,
        error: leaveError,
        leaveUpdates: leave_updates
      }
    } = this.props;

    if (
      approvedLoading ||
      pendingLoading ||
      cancelledLoading ||
      declinedLoading ||
      userLoading ||
      leaveLoading
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
      leaveError
    ) {
      console.log(
        approvedError ||
          pendingError ||
          cancelledError ||
          declinedError ||
          userError ||
          leaveError
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
  graphql(APPROVED_RECORD, {
    name: 'approvedRecord'
  }),
  graphql(PENDING_RECORD, {
    name: 'pendingRecord'
  }),
  graphql(CANCELLED_RECORD, {
    name: 'cancelledRecord'
  }),
  graphql(DECLINED_RECORD, {
    name: 'declinedRecord'
  }),
  graphql(USER_UPDATES_RECORD, {
    name: 'userUpdates'
  }),
  graphql(LEAVE_UPDATES_RECORD, {
    name: 'leaveUpdates'
  })
)(LeaveReport);
