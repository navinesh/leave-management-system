import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';
import CreateUserForm from '../components/CreateUser';

const IS_AUTHENTICATED = gql`
  query isAdminAuthenticated {
    isAuthenticated @client
    admin_token @client
  }
`;

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      Admin {
        othernames
      }
      token
      ok
    }
  }
`;

export default function CreateUser(): JSX.Element {
  const client = useApolloClient();

  const { data } = useQuery(IS_AUTHENTICATED);
  let adminToken = data.admin_token
    ? data.admin_token
    : localStorage.getItem('admin_token');

  const [verifyAdminToken] = useMutation(VERIFY_ADMIN_TOKEN, {
    variables: { adminToken: adminToken },
    onCompleted(data) {
      if (data.verifyAdminToken) {
        TokenSuccess(data, client);
      } else {
        TokenFailure(client);
      }
    }
  });

  useEffect((): void => {
    verifyAdminToken();
  }, [verifyAdminToken]);

  return data.isAuthenticated ? <CreateUserForm /> : <Redirect to="/login" />;
}
