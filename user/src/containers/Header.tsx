import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Navs from '../components/Header';

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

export default function Header(): JSX.Element {
  return (
    <Query query={IS_AUTHENTICATED}>
      {({ data }: any) => {
        return <Navs isAuthenticated={data.isAuthenticated} />;
      }}
    </Query>
  );
}
