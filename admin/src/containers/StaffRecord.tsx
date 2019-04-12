import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';
import StaffRecordList from '../components/StaffRecord';

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

const ACTIVE_USERS = gql`
  {
    findUsers(isArchived: "false") {
      id
      dbId
      othernames
      surname
      email
      annual
      sick
      bereavement
      familyCare
      christmas
      dateOfBirth
      maternity
      paternity
      gender
      designation
      employeeNumber
      employeeStartDate
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
      <Query query={ACTIVE_USERS} pollInterval={60000}>
        {({
          loading,
          error,
          data: { findUsers: staff_record },
          refetch
        }: any) => {
          if (loading) {
            return (
              <div className="text-center" style={{ marginTop: '80px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            );
          }

          if (error) {
            console.log(error);
            return (
              <div className="text-center">
                <p>Something went wrong!</p>
              </div>
            );
          }

          return (
            <StaffRecordList staff_record={staff_record} refetch={refetch} />
          );
        }}
      </Query>
    </div>
  );
}

export default function StaffRecord(): JSX.Element {
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
