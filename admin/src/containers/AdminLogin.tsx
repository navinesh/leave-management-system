import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { Redirect } from 'react-router-dom';

import Login from '../components/AdminLogin';

const IS_AUTHENTICATED = gql`
  query isAdminAuthenticated {
    isAuthenticated @client
    sessionError @client
  }
`;

export default function AdminLogin(): JSX.Element {
  const { data } = useQuery(IS_AUTHENTICATED);

  return !data.isAuthenticated ? (
    <Login sessionError={data.sessionError} />
  ) : (
    <Redirect to="/" />
  );
}
