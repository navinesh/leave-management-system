import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import UserRecord from '../components/UserRecord';

const GET_ID = gql`
  query Id {
    id @client
  }
`;

export default function UserRecords(): JSX.Element {
  return (
    <Query query={GET_ID}>
      {({ data }) => {
        let id = data.id ? data.id : localStorage.getItem('id');
        return <UserRecord id={id} />;
      }}
    </Query>
  );
}
