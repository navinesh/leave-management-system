// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import {
  requestUserLoginFromToken,
  receiveUserLoginFromToken,
  loginUserErrorFromToken
} from '../actions/UserLogin';
import LeaveCalendar from './LeaveCalendar';
import UserLogin from './UserLogin';

const VERIFY_USER_TOKEN = gql`
  mutation verifyUserToken($userToken: String!) {
    verifyUserToken(userToken: $userToken) {
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

class Login extends Component<Props> {
  componentDidMount() {
    const { auth_info } = this.props;
    let auth_token = auth_info.auth_token
      ? auth_info.auth_token
      : localStorage.getItem('auth_token');

    if (auth_token) {
      this.verifyToken();
    }
  }

  verifyToken = async () => {
    const { dispatch, verifyUserToken } = this.props;
    const userToken = localStorage.getItem('auth_token');

    try {
      dispatch(requestUserLoginFromToken());
      const response = await verifyUserToken({
        variables: { userToken }
      });
      dispatch(receiveUserLoginFromToken(response.data.verifyUserToken.token));
    } catch (error) {
      console.log(error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      dispatch(loginUserErrorFromToken('Your session has expired!'));
    }
  };

  render() {
    return (
      <div className="Main">
        {!this.props.isAuthenticated ? (
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <LeaveCalendar />
              </div>
              <div className="col-md-4">
                <UserLogin />
              </div>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { userAuth } = state;
  const { auth_info, isAuthenticated } = userAuth;

  return { auth_info, isAuthenticated };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_USER_TOKEN, {
    name: 'verifyUserToken'
  })
)(Login);
