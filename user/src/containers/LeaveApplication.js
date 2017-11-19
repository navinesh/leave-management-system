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
import { fetchLeaveApplication } from '../actions/LeaveApplication';
import Application from '../components/LeaveApplication';

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
  message: string,
  verifyUserToken: Function
};

class LeaveApplication extends Component<Props> {
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
  };

  render() {
    const { dispatch, isAuthenticated, auth_info, message } = this.props;
    let id = auth_info.id ? auth_info.id : localStorage.getItem('id');

    return (
      <div className="LeaveApplication">
        {isAuthenticated ? (
          <Application
            id={id}
            message={message}
            dispatch={dispatch}
            onLeaveApplicationClick={applicationDetails =>
              dispatch(fetchLeaveApplication(applicationDetails))}
          />
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { userAuth, leaveApplication } = state;
  const { auth_info, isAuthenticated } = userAuth;
  const { message } = leaveApplication;

  return {
    auth_info,
    isAuthenticated,
    message
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_USER_TOKEN, {
    name: 'verifyUserToken'
  })
)(LeaveApplication);
