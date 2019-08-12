import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import UserResetPassword from '../components/ResetPassword';

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

export default function ResetPassword(): JSX.Element {
  const { data } = useQuery(IS_AUTHENTICATED);

  return !data.isAuthenticated ? (
    <div className="container">
      <UserResetPassword />
    </div>
  ) : (
    <Redirect to="/" />
  );
}
