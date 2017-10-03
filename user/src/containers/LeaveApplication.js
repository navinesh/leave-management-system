// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchLoginFromToken } from '../actions/UserLogin';

import { fetchLeaveApplication } from '../actions/LeaveApplication';
import Application from '../components/LeaveApplication';

type Props = {
  auth_info: Object,
  dispatch: Function,
  isAuthenticated: boolean,
  message: string
};

class LeaveApplication extends Component<Props> {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let auth_token = auth_info.auth_token
      ? auth_info.auth_token
      : localStorage.getItem('auth_token');

    if (auth_token) {
      dispatch(fetchLoginFromToken(auth_token));
    }
  }

  render() {
    const { dispatch, isAuthenticated, message } = this.props;
    let userID = this.props.auth_info.user_id
      ? this.props.auth_info.user_id
      : localStorage.getItem('user_id');
    return (
      <div className="LeaveApplication">
        {isAuthenticated ? (
          <Application
            id={userID}
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

export default connect(mapStateToProps)(LeaveApplication);
