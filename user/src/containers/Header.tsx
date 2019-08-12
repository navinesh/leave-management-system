import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Navs from '../components/Header';

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

export default function Header(): JSX.Element {
  const { data } = useQuery(IS_AUTHENTICATED);

  return <Navs isAuthenticated={data.isAuthenticated} />;
}
