import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';
import PendingLeaveList from '../components/PendingLeave';

const IS_AUTHENTICATED = gql`
  query isAdminAuthenticated {
    isAuthenticated @client
    admin_token @client
  }
`;

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      Admin {
        othernames
      }
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

export default function PendingLeave(): JSX.Element {
  const client = useApolloClient();

  const { data } = useQuery(IS_AUTHENTICATED);
  let adminToken = data.admin_token
    ? data.admin_token
    : localStorage.getItem('admin_token');

  const { loading, error, data: pendingItemsData, refetch }: any = useQuery(
    LEAVE_RECORD,
    {
      pollInterval: 60000,
    }
  );

  const {
    loading: holidayLoading,
    error: holidayError,
    data: publicHolidayData,
  }: any = useQuery(PUBLIC_HOLIDAY);

  const [verifyAdminToken] = useMutation(VERIFY_ADMIN_TOKEN, {
    variables: { adminToken: adminToken },
    onCompleted(data) {
      if (data.verifyAdminToken) {
        TokenSuccess(data, client);
      } else {
        TokenFailure(client);
      }
    },
  });

  useEffect((): void => {
    verifyAdminToken();
  }, [verifyAdminToken]);

  if (loading || holidayLoading) {
    return (
      <div className="container">
        <div className="text-center" style={{ marginTop: '80px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || holidayError) {
    console.log(error || holidayError);
    return (
      <div className="container">
        <div className="text-center">
          <p>Something went wrong!</p>
        </div>
      </div>
    );
  }

  return data.isAuthenticated ? (
    <div className="container">
      <PendingLeaveList
        pending_items={pendingItemsData.findLeaveRecord}
        public_holiday={publicHolidayData.publicHoliday}
        refetch={refetch}
      />
    </div>
  ) : (
    <Redirect to="/login" />
  );
}
