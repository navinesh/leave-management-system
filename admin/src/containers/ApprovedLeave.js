// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import {
  requestAdminLoginFromToken,
  receiveAdminLoginFromToken,
  loginAdminErrorFromToken
} from '../actions/AdminLogin';
import { submitEditApprovedLeave } from '../actions/EditLeave';
import { submitCancelLeave } from '../actions/CancelLeave';
import ApprovedLeaveList from '../components/ApprovedLeave';

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
      dbId
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
  approvedRecord: Object,
  publicHolidays: Object,
  isFetching: boolean,
  dispatch: Function,
  isEditLeaveFetching: boolean,
  editLeaveMessage: string,
  isCancelLeaveFetching: boolean,
  cancelLeaveMessage: string,
  verifyAdminToken: Function
};

class ApprovedLeave extends Component<Props> {
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
        loading,
        error,
        findLeaveRecord: approved_items,
        refetch
      },
      publicHolidays: {
        loading: holidayLoading,
        error: holidayError,
        publicHoliday
      },
      dispatch,
      isEditLeaveFetching,
      editLeaveMessage,
      isCancelLeaveFetching,
      cancelLeaveMessage
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
          <ApprovedLeaveList
            approved_items={approved_items}
            public_holiday={publicHoliday}
            refetch={refetch}
            dispatch={dispatch}
            isEditLeaveFetching={isEditLeaveFetching}
            editLeaveMessage={editLeaveMessage}
            isCancelLeaveFetching={isCancelLeaveFetching}
            cancelLeaveMessage={cancelLeaveMessage}
            onEditApprovedLeaveSubmit={editLeaveData =>
              dispatch(submitEditApprovedLeave(editLeaveData))
            }
            onCancelLeaveSubmit={cancelLeaveData =>
              dispatch(submitCancelLeave(cancelLeaveData))
            }
          />
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, editLeave, cancelLeave } = state;
  const { auth_info, isAuthenticated } = adminAuth;

  const { isEditLeaveFetching, editLeaveMessage } = editLeave;
  const { isCancelLeaveFetching, cancelLeaveMessage } = cancelLeave;

  return {
    auth_info,
    isAuthenticated,
    isEditLeaveFetching,
    editLeaveMessage,
    isCancelLeaveFetching,
    cancelLeaveMessage
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  }),
  graphql(APPROVED_RECORD, {
    name: 'approvedRecord',
    options: { pollInterval: 60000 }
  }),
  graphql(PUBLIC_HOLIDAY, { name: 'publicHolidays' })
)(ApprovedLeave);
