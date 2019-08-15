import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Header from '../components/AdminHeader';

const IS_AUTHENTICATED = gql`
  query isAdminAuthenticated {
    isAuthenticated @client
  }
`;

export default function AdminHeader(): JSX.Element {
  const { data } = useQuery(IS_AUTHENTICATED);

  return data.isAuthenticated && <Header />;
}
