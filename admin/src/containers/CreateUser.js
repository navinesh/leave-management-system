// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import {
  requestAdminLoginFromToken,
  receiveAdminLoginFromToken,
  loginAdminErrorFromToken
} from '../actions/AdminLogin';
import CreateUserForm from '../components/CreateUser';
import {
  submitNewUserRecord,
  clearNewUserRecordMessage
} from '../actions/CreateUser';

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      token
      ok
    }
  }
`;

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  dispatch: Function,
  isFetching: boolean,
  message: string,
  verifyAdminToken: Function
};

function CreateUser(props: Props) {
  useEffect(function() {
    verifyToken();
    setInterval(verifyToken, 600000);
    return {
      function() {
        props.dispatch(clearNewUserRecordMessage());
      }
    };
  }, []);

  async function verifyToken() {
    const { auth_info, dispatch, verifyAdminToken } = props;

    const adminToken = auth_info.admin_token
      ? auth_info
      : localStorage.getItem('admin_token');

    if (adminToken) {
      try {
        dispatch(requestAdminLoginFromToken());
        const response = await verifyAdminToken({
          variables: { adminToken }
        });
        dispatch(
          receiveAdminLoginFromToken(response.data.verifyAdminToken.token)
        );
      } catch (error) {
        console.log(error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        dispatch(loginAdminErrorFromToken('Your session has expired!'));
      }
    }
  }

  const { isAuthenticated, dispatch, message, isFetching } = props;

  return (
    <>
      {isAuthenticated ? (
        <CreateUserForm
          isFetching={isFetching}
          message={message}
          dispatch={dispatch}
          onNewUserRecordSubmit={function(newUserDetails) {
            return dispatch(submitNewUserRecord(newUserDetails));
          }}
        />
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { adminAuth, addUser } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, message } = addUser;

  return { auth_info, isAuthenticated, isFetching, message };
}

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  })
)(CreateUser);
