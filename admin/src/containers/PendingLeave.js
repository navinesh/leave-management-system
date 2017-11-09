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
import { submitApproveLeave } from '../actions/ApproveLeave';
import { submitDeclineLeave } from '../actions/DeclineLeave';
import { submitEditLeave } from '../actions/EditLeave';
import PendingLeaveList from '../components/PendingLeave';

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      token
      ok
    }
  }
`;

const LEAVE_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "pending", isArchived: "false") {
      id
      dbId
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveReason
      leaveStatus
      user {
        othernames
        surname
      }
    }
  }
`;

const PUBLIC_HOLIDAY = gql`
  {
    publicHoliday {
      edges {
        node {
          id
          holidayDate
        }
      }
    }
  }
`;

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  leaveRecord: Object,
  publicHolidays: Object,
  dispatch: Function,
  isApproveLeaveFetching: boolean,
  approveLeavemessage: string,
  isEditLeaveFetching: boolean,
  editLeaveMessage: string,
  isDeclineLeaveFetching: boolean,
  declineLeaveMessage: string,
  verifyAdminToken: Function
};

class PendingLeave extends Component<Props> {
  componentWillMount() {
    const { auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      this.verifyToken();
    }
  }

  verifyToken = async () => {
    const { dispatch, verifyAdminToken } = this.props;
    const adminToken = localStorage.getItem('admin_token');

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
  };

  render() {
    const {
      isAuthenticated,
      leaveRecord: { loading, error, findLeaveRecord: pending_items, refetch },
      publicHolidays: {
        loading: holidayLoading,
        error: holidayError,
        publicHoliday
      },
      dispatch,
      isApproveLeaveFetching,
      approveLeavemessage,
      isEditLeaveFetching,
      editLeaveMessage,
      isDeclineLeaveFetching,
      declineLeaveMessage
    } = this.props;

    if (loading || holidayLoading) {
      return (
        <div className="text-center">
          <div className="loader1" />
        </div>
      );
    }

    if (error || holidayError) {
      console.log(error.message, holidayError.message);
      return (
        <div className="text-center">
          <p>Something went wrong!</p>
        </div>
      );
    }

    return (
      <div className="container">
        {isAuthenticated ? (
          <PendingLeaveList
            pending_items={pending_items}
            public_holiday={publicHoliday}
            refetch={refetch}
            dispatch={dispatch}
            isApproveLeaveFetching={isApproveLeaveFetching}
            approveLeavemessage={approveLeavemessage}
            isEditLeaveFetching={isEditLeaveFetching}
            editLeaveMessage={editLeaveMessage}
            isDeclineLeaveFetching={isDeclineLeaveFetching}
            declineLeaveMessage={declineLeaveMessage}
            onApproveLeaveSubmit={approveLeaveData =>
              dispatch(submitApproveLeave(approveLeaveData))}
            onDeclineLeaveSubmit={declineLeaveData =>
              dispatch(submitDeclineLeave(declineLeaveData))}
            onEditLeaveSubmit={editLeaveData =>
              dispatch(submitEditLeave(editLeaveData))}
          />
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, approveLeave, editLeave, declineLeave } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isApproveLeaveFetching, approveLeavemessage } = approveLeave;
  const { isEditLeaveFetching, editLeaveMessage } = editLeave;
  const { isDeclineLeaveFetching, declineLeaveMessage } = declineLeave;

  return {
    auth_info,
    isAuthenticated,
    isApproveLeaveFetching,
    approveLeavemessage,
    isEditLeaveFetching,
    editLeaveMessage,
    isDeclineLeaveFetching,
    declineLeaveMessage
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  }),
  graphql(LEAVE_RECORD, { name: 'leaveRecord' }),
  graphql(PUBLIC_HOLIDAY, { name: 'publicHolidays' })
)(PendingLeave);
