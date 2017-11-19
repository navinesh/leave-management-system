// @flow
import React from 'react';
import { connect } from 'react-redux';

import UserRecord from '../components/UserRecord';

type Props = {
  auth_info: Object
};

const UserRecords = (props: Props) => {
  let id = props.auth_info.id ? props.auth_info.id : localStorage.getItem('id');

  return <UserRecord id={id} />;
};

const mapStateToProps = state => {
  const { userAuth } = state;
  const { auth_info } = userAuth;
  return { auth_info };
};

export default connect(mapStateToProps)(UserRecords);
