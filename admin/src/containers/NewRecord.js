// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import {
  requestAdminLoginFromToken,
  receiveAdminLoginFromToken,
  loginAdminErrorFromToken
} from '../actions/AdminLogin';
import NewRecordForm from '../components/NewRecord';
import {
  submitNewUserRecord,
  clearNewUserRecordMessage
} from '../actions/NewRecord';

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

class NewRecord extends Component<Props> {
  componentDidMount() {
    this.verifyToken();
  }

  componentWillUnmount() {
    this.props.dispatch(clearNewUserRecordMessage());
  }

  verifyToken = async () => {
    const { auth_info, dispatch, verifyAdminToken } = this.props;

    const adminToken = auth_info.admin_token
      ? auth_info.admin_token
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
        dispatch(loginAdminErrorFromToken('Your session has expired!'));
      }
    }
  };

  render() {
    const { isAuthenticated, dispatch, message, isFetching } = this.props;

    return (
      <Fragment>
        {isAuthenticated ? (
          <NewRecordForm
            isFetching={isFetching}
            message={message}
            dispatch={dispatch}
            onNewUserRecordSubmit={newUserDetails =>
              dispatch(submitNewUserRecord(newUserDetails))
            }
          />
        ) : (
          <Redirect to="/login" />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, addUser } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, message } = addUser;

  return { auth_info, isAuthenticated, isFetching, message };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  })
)(NewRecord);
