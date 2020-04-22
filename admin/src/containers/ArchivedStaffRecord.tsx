import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';
import ArchivedStaffRecordList from '../components/ArchivedStaffRecord';

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

const ARCHIVED_USERS = gql`
  {
    findUsers(isArchived: "true") {
      id
      dbId
      othernames
      surname
      email
      annual
      sick
      bereavement
      familyCare
      christmas
      dateOfBirth
      maternity
      paternity
      gender
    }
  }
`;

export default function ArchivedStaffRecord(): JSX.Element {
  const client = useApolloClient();

  const { data } = useQuery(IS_AUTHENTICATED);
  let adminToken = data.admin_token
    ? data.admin_token
    : localStorage.getItem('admin_token');

  const { loading, error, data: staffRecordData, refetch }: any = useQuery(
    ARCHIVED_USERS,
    {
      pollInterval: 60000,
    }
  );

  const [verifyAdminToken] = useMutation(VERIFY_ADMIN_TOKEN, {
    variables: { adminToken: adminToken },
    onCompleted(data) {
      if (data.verifyAdminToken) {
        TokenSuccess(data, client);
      } else {
        TokenFailure(client);
      }
    },
  });

  useEffect((): void => {
    verifyAdminToken();
  }, [verifyAdminToken]);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center" style={{ marginTop: '80px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="container">
        <div className="text-center">
          <p>Something went wrong!</p>
        </div>
      </div>
    );
  }

  return data.isAuthenticated ? (
    <div className="container">
      <ArchivedStaffRecordList
        archived_staff_record={staffRecordData.findUsers}
        refetch={refetch}
      />
    </div>
  ) : (
    <Redirect to="/login" />
  );
}
