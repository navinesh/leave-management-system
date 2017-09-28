// @flow
import React from 'react';
import { connect } from 'react-redux';

import UserRecord from '../components/UserRecord';

type Props = {
  auth_info: Object
};

const UserRecords = (props: Props) => {
  let userID = props.auth_info.user_id
    ? props.auth_info.user_id
    : localStorage.getItem('user_id');

  return <UserRecord id={userID} />;
};

const mapStateToProps = state => {
  const { userAuth } = state;
  const { auth_info } = userAuth;
  return { auth_info };
};

export default connect(mapStateToProps)(UserRecords);
