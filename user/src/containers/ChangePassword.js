// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import UserChange from '../components/ChangePassword';
import {
  changePassword,
  clearChangePasswordError
} from '../actions/ChangePassword';

type Props = {
  auth_info: Object,
  dispatch: Function,
  isAuthenticated: boolean,
  message: string,
  isFetching: boolean
};

class UserChangePassword extends Component<Props> {
  componentDidMount() {
    this.props.dispatch(clearChangePasswordError());
  }

  render() {
    const {
      dispatch,
      isAuthenticated,
      message,
      isFetching,
      auth_info
    } = this.props;

    return (
      <div className="UserAccount">
        {isAuthenticated
          ? <UserChange
              isFetching={isFetching}
              message={message}
              auth_info={auth_info}
              onChangeClick={creds => dispatch(changePassword(creds))}
            />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { changePassword } = state;
  const { userAuth } = state;
  const { auth_info, isAuthenticated } = userAuth;
  const { isFetching, message } = changePassword;

  return { auth_info, isAuthenticated, isFetching, message };
};

export default connect(mapStateToProps)(UserChangePassword);
