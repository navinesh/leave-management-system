import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import Calendar from '../components/Calendar';
import UserLogin from '../components/UserLogin';

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
    sessionError @client
  }
`;

export default function Login(): JSX.Element {
  return (
    <Query query={IS_AUTHENTICATED}>
      {({ data }) => {
        return !data.isAuthenticated ? (
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <Calendar />
              </div>
              <div className="col-md-4">
                <UserLogin sessionError={data.sessionError} />
              </div>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        );
      }}
    </Query>
  );
}
