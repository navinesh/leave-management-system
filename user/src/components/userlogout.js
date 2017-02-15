import React, { PropTypes } from "react";

const Logout = ({ onLogoutClick }) => (
  <button onClick={() => onLogoutClick()} className="btn btn-primary-outline">
    Log out
  </button>
);

Logout.propTypes = { onLogoutClick: PropTypes.func.isRequired };

export default Logout;
