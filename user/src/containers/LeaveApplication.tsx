import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';
import Application from '../components/LeaveApplication';
import useInterval from './UseInterval';

const REQUEST_DATA = gql`
  query requestData {
    isAuthenticated @client
    id @client
    auth_token @client
  }
`;

const VERIFY_USER_TOKEN = gql`
  mutation verifyUserToken($userToken: String!) {
    verifyUserToken(userToken: $userToken) {
      User {
        id
        dbId
      }
      token
      ok
    }
  }
`;

export default function LeaveApplication(): JSX.Element {
  const client = useApolloClient();
  const { data } = useQuery(REQUEST_DATA);

  let userToken = data.auth_token
    ? data.auth_token
    : localStorage.getItem('auth_token');

  const [verifyToken] = useMutation(VERIFY_USER_TOKEN, {
    variables: { userToken: userToken },
    onCompleted(data: any) {
      if (data.verifyUserToken) {
        TokenSuccess(data, client);
      } else {
        TokenFailure(client);
      }
    }
  });

  useEffect((): void => {
    verifyToken();
  }, [verifyToken]);

  useInterval((): void => {
    verifyToken();
  }, 600000);

  return data.isAuthenticated ? (
    <Application id={data.id} />
  ) : (
    <Redirect to="/login" />
  );
}
