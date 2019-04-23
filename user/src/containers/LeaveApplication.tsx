import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';
import Application from '../components/LeaveApplication';
import useInterval from './UseInterval';

const REQUEST_DATA = gql`
  query requestData {
    isAuthenticated @client
    id @client
    auth_token @client
  }
`;

const VERIFY_USER_TOKEN = gql`
  mutation verifyUserToken($userToken: String!) {
    verifyUserToken(userToken: $userToken) {
      User {
        id
        dbId
      }
      token
      ok
    }
  }
`;

type Props = {
  verifyToken: Function;
};

function MainView(props: Props): JSX.Element {
  const { verifyToken } = props;
  useEffect(
    function(): void {
      verifyToken();
    },
    [verifyToken]
  );

  useInterval(function(): void {
    props.verifyToken();
  }, 600000);

  return (
    <Query query={REQUEST_DATA}>
      {({ data }: any) => {
        return data.isAuthenticated ? (
          <Application id={data.id} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    </Query>
  );
}

export default function LeaveApplication(): JSX.Element {
  return (
    <Query query={REQUEST_DATA}>
      {({ data }: any) => {
        let userToken = data.auth_token
          ? data.auth_token
          : localStorage.getItem('auth_token');

        return data.isAuthenticated ? (
          <ApolloConsumer>
            {client => (
              <Mutation
                mutation={VERIFY_USER_TOKEN}
                variables={{ userToken: userToken }}
                onCompleted={(data: any) => {
                  if (data.verifyUserToken) {
                    TokenSuccess(data, client);
                  } else {
                    TokenFailure(client);
                  }
                }}
              >
                {(verifyToken: any) => {
                  return <MainView verifyToken={verifyToken} />;
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
