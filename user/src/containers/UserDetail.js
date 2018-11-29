// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import UserDetail from '../components/UserDetail';

const GET_ID = gql`
  query Id {
    id @client
  }
`;

export default function UserDetails() {
  return (
    <Query query={GET_ID}>
      {({ data }) => {
        let id = data.id ? data.id : localStorage.getItem('id');
        return <UserDetail id={id} />;
      }}
    </Query>
  );
}
