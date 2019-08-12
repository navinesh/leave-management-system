import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import UserChange from '../components/ChangePassword';

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
    auth_token @client
  }
`;

export default function UserChangePassword(): JSX.Element {
  const { data } = useQuery(IS_AUTHENTICATED);

  return data.isAuthenticated ? (
    <UserChange auth_token={data.auth_token} />
  ) : (
    <Redirect to="/" />
  );
}
