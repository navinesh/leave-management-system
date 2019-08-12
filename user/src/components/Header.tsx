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
            id: null,
            auth_token: null
          }
        });
        localStorage.clear();
      }}
      className="btn btn-sm btn-primary"
    >
      Logout
    </button>
  );
}

type Props = {
  isAuthenticated: boolean;
};

export default function Navs(props: Props): JSX.Element {
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
        {props.isAuthenticated && (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="navbar-nav flex-fill justify-content-center">
              <NavLink
                className="nav-item nav-link"
                style={{ color: 'grey' }}
                activeStyle={{
                  color: '#007bff'
                }}
                exact
                to="/"
              >
                <div className="centered-label">Home</div>
              </NavLink>
              <NavLink
                className="nav-item nav-link ml-4 mr-4"
                style={{ color: 'grey' }}
                activeStyle={{
                  color: '#007bff'
                }}
                to="/leaveapplication"
              >
                <div className="centered-label">Apply for leave</div>
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                style={{ color: 'grey' }}
                activeStyle={{
                  color: '#007bff'
                }}
                to="/leavecalendar"
              >
                <div className="centered-label">Calendar</div>
              </NavLink>
            </div>
            <Logout />
          </div>
        )}
      </div>
    </nav>
  );
}
