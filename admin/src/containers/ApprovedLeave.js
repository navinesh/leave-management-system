// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql, compose, Query } from 'react-apollo';

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
        gender
        familyCare
        maternity
        paternity
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
  isFetching: boolean,
  dispatch: Function,
  isEditLeaveFetching: boolean,
  editLeaveMessage: string,
  isCancelLeaveFetching: boolean,
  cancelLeaveMessage: string,
  verifyAdminToken: Function
};

function ApprovedLeave(props: Props) {
  useEffect(function() {
    verifyToken();
    setInterval(verifyToken, 600000);
  }, []);

  async function verifyToken() {
    const { auth_info, dispatch, verifyAdminToken } = props;

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
        localStorage.removeItem('admin_user');
        dispatch(loginAdminErrorFromToken('Your session has expired!'));
      }
    }
  }

  const {
    isAuthenticated,
    dispatch,
    isEditLeaveFetching,
    editLeaveMessage,
    isCancelLeaveFetching,
    cancelLeaveMessage
  } = props;

  return (
    <div className="container">
      {isAuthenticated ? (
        <Query query={APPROVED_RECORD} pollInterval={60000}>
          {({
            loading,
            error,
            data: { findLeaveRecord: approved_items },
            refetch
          }) => (
            <Query query={PUBLIC_HOLIDAY}>
              {({
                loading: holidayLoading,
                error: holidayError,
                data: { publicHoliday }
              }) => {
                if (loading || holidayLoading) {
                  return (
                    <div className="text-center">
                      <div className="loader1" />
                    </div>
                  );
                }

                if (error || holidayError) {
                  console.log(error || holidayError);
                  return (
                    <div className="text-center">
                      <p>Something went wrong!</p>
                    </div>
                  );
                }

                return (
                  <ApprovedLeaveList
                    approved_items={approved_items}
                    public_holiday={publicHoliday}
                    refetch={refetch}
                    dispatch={dispatch}
                    isEditLeaveFetching={isEditLeaveFetching}
                    editLeaveMessage={editLeaveMessage}
                    isCancelLeaveFetching={isCancelLeaveFetching}
                    cancelLeaveMessage={cancelLeaveMessage}
                    onEditApprovedLeaveSubmit={function(editLeaveData) {
                      return dispatch(submitEditApprovedLeave(editLeaveData));
                    }}
                    onCancelLeaveSubmit={function(cancelLeaveData) {
                      return dispatch(submitCancelLeave(cancelLeaveData));
                    }}
                  />
                );
              }}
            </Query>
          )}
        </Query>
      ) : (
        <Redirect to="/login" />
      )}
    </div>
  );
}

function mapStateToProps(state) {
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
}

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  })
)(ApprovedLeave);
