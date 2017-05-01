// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserChange from '../components/changepassword';
import {
  changePassword,
  clearChangePasswordError
} from '../actions/changepassword';

class UserChangePassword extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(clearChangePasswordError());
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
        {isAuthenticated &&
          <div className="col col-md-4 offset-md-4">
            <UserChange
              isFetching={isFetching}
              message={message}
              auth_info={auth_info}
              onChangeClick={creds => dispatch(changePassword(creds))}
            />
          </div>}
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
