import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import UserRecord from '../components/UserRecord';

const GET_ID = gql`
  query Id {
    id @client
  }
`;

export default function UserRecords(): JSX.Element {
  const { data } = useQuery(GET_ID);

  let id = data.id ? data.id : localStorage.getItem('id');

  return <UserRecord id={id} />;
}
