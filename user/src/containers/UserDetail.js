// @flow
import React from 'react';
import { connect } from 'react-redux';
import UserDetail from '../components/UserDetail';

type Props = {
  auth_info: Object
};

const UserDetails = (props: Props) => {
  let userID = props.auth_info.user_id
    ? props.auth_info.user_id
    : localStorage.getItem('user_id');

  return <UserDetail id={userID} />;
};

const mapStateToProps = state => {
  const { userAuth } = state;
  const { auth_info } = userAuth;
  return { auth_info };
};

export default connect(mapStateToProps)(UserDetails);
