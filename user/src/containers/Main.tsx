import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';
import UserDetail from './UserDetail';
import UserRecord from './UserRecord';
import useInterval from './UseInterval';

const REQUEST_DATA = gql`
  query requestData {
    isAuthenticated @client
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
  useEffect(function(): void {
    props.verifyToken();
  }, []);

  useInterval(function(): void {
    props.verifyToken();
  }, 600000);

  return (
    <Query query={REQUEST_DATA}>
      {({ data }) => {
        return data.isAuthenticated ? (
          <div>
            <UserDetail /> <UserRecord />
          </div>
        ) : (
          <Redirect to="/login" />
        );
      }}
    </Query>
  );
}

export default function Main(): JSX.Element {
  return (
    <Query query={REQUEST_DATA}>
      {({ data }) => {
        let userToken = data.auth_token
          ? data.auth_token
          : localStorage.getItem('auth_token');
        return (
          <ApolloConsumer>
            {client => (
              <Mutation
                mutation={VERIFY_USER_TOKEN}
                variables={{ userToken: userToken }}
                onCompleted={data => {
                  if (data.verifyUserToken) {
                    TokenSuccess(data, client);
                  } else {
                    TokenFailure(client);
                  }
                }}
              >
                {verifyToken => {
                  return <MainView verifyToken={verifyToken} />;
                }}
              </Mutation>
            )}
          </ApolloConsumer>
        );
      }}
    </Query>
  );
}
