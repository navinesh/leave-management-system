// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import {
  requestUserLoginFromToken,
  receiveUserLoginFromToken,
  loginUserErrorFromToken
} from '../actions/UserLogin';
import UserDetail from './UserDetail';
import UserRecord from './UserRecord';

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

type Props = {
  auth_info: Object,
  dispatch: Function,
  isAuthenticated: boolean,
  verifyUserToken: Function
};

class Main extends Component<Props> {
  verifyToken: Function;

  constructor() {
    super();
    this.verifyToken = this.verifyToken.bind(this);
  }
  componentDidMount() {
    this.verifyToken();
    setInterval(this.verifyToken, 600000);
  }

  async verifyToken() {
    const { auth_info, dispatch, verifyUserToken } = this.props;

    const userToken = auth_info.auth_token
      ? auth_info.auth_token
      : localStorage.getItem('auth_token');

    if (userToken) {
      try {
        dispatch(requestUserLoginFromToken());
        const response = await verifyUserToken({
          variables: { userToken }
        });
        const auth_info = {
          auth_token: response.data.verifyUserToken.token,
          user_id: response.data.verifyUserToken.User.dbId,
          id: response.data.verifyUserToken.User.id
        };
        dispatch(receiveUserLoginFromToken(auth_info));
      } catch (error) {
        console.log(error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('id');
        dispatch(loginUserErrorFromToken('Your session has expired!'));
      }
    }
  }

  render() {
    return (
      <Fragment>
        {this.props.isAuthenticated ? (
          <div>
            <UserDetail /> <UserRecord />
          </div>
        ) : (
          <Redirect to="/login" />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { userAuth } = state;
  const { auth_info, isAuthenticated } = userAuth;

  return { auth_info, isAuthenticated };
}

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_USER_TOKEN, { name: 'verifyUserToken' })
)(Main);
