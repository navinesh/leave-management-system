import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
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

type Props = {
  verifyAdminToken: Function;
};

function MainView(props: Props): JSX.Element {
  useEffect(function(): void {
    props.verifyAdminToken();
  }, []);

  return (
    <div className="container">
      <Query query={LEAVE_RECORD} pollInterval={60000}>
        {({
          loading,
          error,
          data: { findLeaveRecord: pending_items },
          refetch
        }: any) => (
          <Query query={PUBLIC_HOLIDAY}>
            {({
              loading: holidayLoading,
              error: holidayError,
              data: { publicHoliday }
            }: any) => {
              if (loading || holidayLoading) {
                return (
                  <div className="text-center" style={{ marginTop: '80px' }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
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
                <PendingLeaveList
                  pending_items={pending_items}
                  public_holiday={publicHoliday}
                  refetch={refetch}
                />
              );
            }}
          </Query>
        )}
      </Query>
    </div>
  );
}

export default function PendingLeave(): JSX.Element {
  return (
    <Query query={IS_AUTHENTICATED}>
      {({ data }: any) => {
        let adminToken = data.admin_token
          ? data.admin_token
          : localStorage.getItem('admin_token');

        return data.isAuthenticated ? (
          <ApolloConsumer>
            {client => (
              <Mutation
                mutation={VERIFY_ADMIN_TOKEN}
                variables={{ adminToken: adminToken }}
                onCompleted={(data: any) => {
                  if (data.verifyAdminToken) {
                    TokenSuccess(data, client);
                  } else {
                    TokenFailure(client);
                  }
                }}
              >
                {(verifyAdminToken: any) => {
                  return <MainView verifyAdminToken={verifyAdminToken} />;
                }}
              </Mutation>
            )}
          </ApolloConsumer>
        ) : (
          <Redirect to="/login" />
        );
      }}
    </Query>
  );
}
