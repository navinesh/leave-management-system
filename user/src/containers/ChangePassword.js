// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import UserChange from '../components/ChangePassword';

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
    auth_token @client
  }
`;

export default function UserChangePassword() {
  return (
    <Query query={IS_AUTHENTICATED}>
      {({ data }) => {
        return data.isAuthenticated ? (
          <UserChange auth_token={data.auth_token} />
        ) : (
          <Redirect to="/" />
        );
      }}
    </Query>
  );
}
