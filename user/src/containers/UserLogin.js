// @flow
import React from 'react';
import { connect } from 'react-redux';

import { fetchLogin } from '../actions/UserLogin';
import Login from '../components/UserLogin';

type Props = {
  dispatch: Function,
  isAuthenticated: boolean,
  message: string,
  isFetching: boolean
};

const UserLogin = (props: Props) =>
  <div className="UserLogin">
    {!props.isAuthenticated &&
      <Login
        isFetching={props.isFetching}
        message={props.message}
        onLoginClick={creds => props.dispatch(fetchLogin(creds))}
      />}
  </div>;

const mapStateToProps = state => {
  const { userAuth } = state;
  const { isAuthenticated, message, isFetching } = userAuth;

  return { isAuthenticated, message, isFetching };
};

export default connect(mapStateToProps)(UserLogin);
