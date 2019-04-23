import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';
import ApprovedLeaveList from '../components/ApprovedLeave';

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
  verifyAdminToken: Function;
};

function MainView(props: Props): JSX.Element {
  const { verifyAdminToken } = props;
  useEffect(
    function(): void {
      verifyAdminToken();
    },
    [verifyAdminToken]
  );

  return (
    <div className="container">
      <Query query={APPROVED_RECORD} pollInterval={60000}>
        {({
          loading,
          error,
          data: { findLeaveRecord: approved_items },
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
                <ApprovedLeaveList
                  approved_items={approved_items}
                  public_holiday={publicHoliday}
                  refetch={refetch}
                  APPROVED_RECORD={APPROVED_RECORD}
                />
              );
            }}
          </Query>
        )}
      </Query>
    </div>
  );
}

export default function ApprovedLeave(): JSX.Element {
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
