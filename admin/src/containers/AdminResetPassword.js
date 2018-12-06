// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import AdminResetPassword from '../components/AdminResetPassword';

const IS_AUTHENTICATED = gql`
  query isAdminAuthenticated {
    isAuthenticated @client
  }
`;

export default function ResetPassword() {
  return (
    <div className="container">
      <Query query={IS_AUTHENTICATED}>
        {({ data }) => {
          return !data.isAuthenticated ? (
            <AdminResetPassword />
          ) : (
            <Redirect to="/" />
          );
        }}
      </Query>
    </div>
  );
}
