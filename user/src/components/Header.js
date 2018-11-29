// @flow
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Link } from 'react-router-dom';

function Logout() {
  return (
    <ApolloConsumer>
      {client => (
        <button
          onClick={() => {
            client.writeData({
              data: {
                isAuthenticated: false,
                id: null,
                user_id: null,
                auth_token: null
              }
            });
            localStorage.clear();
          }}
          className="btn btn-primary ml-2"
        >
          Logout
        </button>
      )}
    </ApolloConsumer>
  );
}

type Props = {
  isAuthenticated: boolean
};

export default function Navs(props: Props) {
  return (
    <nav className="navbar fixed-top navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Leave Management System
        </Link>
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
          <div className="justify-content-end">
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <div className="navbar-nav">
                <Link className="nav-item nav-link" to="/leaveapplication">
                  Apply for leave
                </Link>
                <Link className="nav-item nav-link" to="/leavecalendar">
                  Leave calendar
                </Link>
                <Logout />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
