// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import {
  requestUserLoginFromToken,
  receiveUserLoginFromToken,
  loginUserErrorFromToken
} from '../actions/UserLogin';
import {
  fetchLeaveApplication,
  clearLeaveApplicationMessage
} from '../actions/LeaveApplication';
import Application from '../components/LeaveApplication';

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

  message: string,
  verifyUserToken: Function
};

function LeaveApplication(props: Props) {
  useEffect(function() {
    verifyToken();
    setInterval(verifyToken, 600000);

    return function() {
      props.dispatch(clearLeaveApplicationMessage());
    };
  }, []);

  async function verifyToken() {
    const { auth_info, dispatch, verifyUserToken } = props;

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
          auth_token: response.data.verifyUserToken.token
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

  const { dispatch, auth_info, message } = props;
  let id = auth_info.id ? auth_info.id : localStorage.getItem('id');

  return (
    <Application
      id={id}
      message={message}
      dispatch={dispatch}
      onLeaveApplicationClick={function(applicationDetails) {
        return dispatch(fetchLeaveApplication(applicationDetails));
      }}
    />
  );
}

function mapStateToProps(state) {
  const { userAuth, leaveApplication } = state;
  const { auth_info } = userAuth;
  const { message } = leaveApplication;

  return {
    auth_info,
    message
  };
}

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_USER_TOKEN, { name: 'verifyUserToken' })
)(LeaveApplication);
