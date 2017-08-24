// @flow
import React from 'react';

type Props = {
  onLogoutClick: Function
};

export default (props: Props) =>
  <button
    onClick={() => props.onLogoutClick()}
    className="btn btn-primary-outline"
  >
    Log out
  </button>;
