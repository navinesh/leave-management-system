// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql, compose, Query } from 'react-apollo';

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
      bereavement
      familyCare
      christmas
      maternity
      paternity
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
      familyCare
      christmas
      maternity
      paternity
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

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  dispatch: Function,
  verifyAdminToken: Function
};

class LeaveReport extends Component<Props> {
  componentDidMount() {
    this.verifyToken();
  }

  verifyToken = async () => {
    const { auth_info, dispatch, verifyAdminToken } = this.props;

    const adminToken = auth_info.admin_token
      ? auth_info
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
    const { isAuthenticated } = this.props;

    return (
      <Fragment>
        {isAuthenticated ? (
          <Query query={APPROVED_RECORD} pollInterval={60000}>
            {({
              loading: approvedLoading,
              error: approvedError,
              data: { findLeaveRecord: approved_record }
            }) => (
              <Query query={PENDING_RECORD} pollInterval={60000}>
                {({
                  loading: pendingLoading,
                  error: pendingError,
                  data: { findLeaveRecord: pending_record }
                }) => (
                  <Query query={CANCELLED_RECORD} pollInterval={60000}>
                    {({
                      loading: cancelledLoading,
                      error: cancelledError,
                      data: { findLeaveRecord: cancelled_record }
                    }) => (
                      <Query query={DECLINED_RECORD} pollInterval={60000}>
                        {({
                          loading: declinedLoading,
                          error: declinedError,
                          data: { findLeaveRecord: declined_record }
                        }) => (
                          <Query
                            query={USER_UPDATES_RECORD}
                            pollInterval={60000}
                          >
                            {({
                              loading: userLoading,
                              error: userError,
                              data: { findUserUpdates: user_updates }
                            }) => (
                              <Query
                                query={LEAVE_UPDATES_RECORD}
                                pollInterval={60000}
                              >
                                {({
                                  loading: leaveLoading,
                                  error: leaveError,
                                  data: { findLeaveUpdates: leave_updates }
                                }) => (
                                  <Query
                                    query={ACTIVE_USERS}
                                    pollInterval={60000}
                                  >
                                    {({
                                      loading: activeUsersLoading,
                                      error: activeUsersError,
                                      data: { findUsers: staff_record }
                                    }) => {
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
                                        <LeaveReportList
                                          approved_record={approved_record}
                                          pending_record={pending_record}
                                          cancelled_record={cancelled_record}
                                          declined_record={declined_record}
                                          user_updates={user_updates}
                                          leave_updates={leave_updates}
                                          staff_record={staff_record}
                                        />
                                      );
                                    }}
                                  </Query>
                                )}
                              </Query>
                            )}
                          </Query>
                        )}
                      </Query>
                    )}
                  </Query>
                )}
              </Query>
            )}
          </Query>
        ) : (
          <Redirect to="/login" />
        )}
      </Fragment>
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
  })
)(LeaveReport);
