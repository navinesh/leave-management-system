// @flow
import React from 'react';

export default ({ onLogoutClick }: { onLogoutClick: Function }) =>
  <button onClick={() => onLogoutClick()} className="btn btn-primary-outline">
    Log out
  </button>;
