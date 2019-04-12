import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import UserResetPassword from '../components/ResetPassword';

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

export default function ResetPassword(): JSX.Element {
  return (
    <div className="container">
      <Query query={IS_AUTHENTICATED}>
        {({ data }: any) => {
          return !data.isAuthenticated ? (
            <UserResetPassword />
          ) : (
            <Redirect to="/" />
          );
        }}
      </Query>
    </div>
  );
}
