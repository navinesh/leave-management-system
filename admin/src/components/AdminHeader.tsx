import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import { NavLink } from 'react-router-dom';

function Logout(): JSX.Element {
  const client = useApolloClient();

  return (
    <button
      onClick={() => {
        client.writeData({
          data: {
            isAuthenticated: false,
            admin_user: null,
            admin_token: null
          }
        });
        localStorage.clear();
      }}
      className="btn btn-primary ml-1"
    >
      Sign out
    </button>
  );
}

export default function Header(): JSX.Element {
  return (
    <nav className="navbar fixed-top navbar-expand-lg">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Leave Management System
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="justify-content-end">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="navbar-nav">
              <NavLink
                className="nav-item nav-link"
                style={{ color: 'grey' }}
                activeStyle={{
                  color: '#007bff'
                }}
                to="/approvedleave"
              >
                Approved
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                style={{ color: 'grey' }}
                activeStyle={{
                  color: '#007bff'
                }}
                to="/staffview"
              >
                Staff
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                style={{ color: 'grey' }}
                activeStyle={{
                  color: '#007bff'
                }}
                to="/createuser"
              >
                Create user
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                style={{ color: 'grey' }}
                activeStyle={{
                  color: '#007bff'
                }}
                to="/leavereport"
              >
                Reports
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                style={{ color: 'grey' }}
                activeStyle={{
                  color: '#007bff'
                }}
                to="/sicksheetrecord"
              >
                Sick sheet
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                style={{ color: 'grey' }}
                activeStyle={{
                  color: '#007bff'
                }}
                to="/publicholiday"
              >
                Public Holidays
              </NavLink>
              <Logout />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
