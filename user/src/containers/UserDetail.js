// @flow
import React from 'react';
import { connect } from 'react-redux';

import UserDetail from '../components/UserDetail';

type Props = {
  auth_info: Object
};

function UserDetails(props: Props) {
  let id = props.auth_info.id ? props.auth_info.id : localStorage.getItem('id');

  return <UserDetail id={id} />;
}

function mapStateToProps(state) {
  const { userAuth } = state;
  const { auth_info } = userAuth;
  return { auth_info };
}

export default connect(mapStateToProps)(UserDetails);
