// @flow
import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import UserDetail from './UserDetail';
import UserRecord from './UserRecord';

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

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
    auth_token @client
  }
`;

type Props = {
  verifyToken: Function
};

function MainView(props: Props) {
  useEffect(function() {
    props.verifyToken();
    setInterval(props.verifyToken, 600000);
  }, []);

  return (
    <Query query={IS_AUTHENTICATED}>
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

export default function Main() {
  return (
    <Query query={IS_AUTHENTICATED}>
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
                    localStorage.setItem('id', data.verifyUserToken.User.id);
                    localStorage.setItem(
                      'auth_token',
                      data.verifyUserToken.token
                    );
                    client.writeData({
                      data: {
                        isAuthenticated: true,
                        id: data.verifyUserToken.User.id,
                        auth_token: data.verifyUserToken.token
                      }
                    });
                  } else {
                    client.writeData({
                      data: {
                        isAuthenticated: false,
                        id: null,
                        auth_token: null,
                        sessionError: 'Your session has expired!'
                      }
                    });
                    localStorage.clear();
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
