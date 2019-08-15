import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import AdminResetPassword from '../components/AdminResetPassword';

const IS_AUTHENTICATED = gql`
  query isAdminAuthenticated {
    isAuthenticated @client
  }
`;

export default function ResetPassword(): JSX.Element {
  const { data } = useQuery(IS_AUTHENTICATED);

  return !data.isAuthenticated ? (
    <div className="container">
      <AdminResetPassword />
    </div>
  ) : (
    <Redirect to="/" />
  );
}
