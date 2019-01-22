import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Header from '../components/AdminHeader';

const IS_AUTHENTICATED = gql`
  query isAdminAuthenticated {
    isAuthenticated @client
  }
`;

export default function AdminHeader(): JSX.Element {
  return (
    <Query query={IS_AUTHENTICATED}>
      {({ data }) => {
        return data.isAuthenticated && <Header />;
      }}
    </Query>
  );
}
