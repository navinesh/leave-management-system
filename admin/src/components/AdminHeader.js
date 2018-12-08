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
      )}
    </ApolloConsumer>
  );
}

export default function Header() {
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
        <div className="justify-content-end">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="navbar-nav">
              <Link className="nav-item nav-link" to="/approvedleave">
                Approved
              </Link>
              <Link className="nav-item nav-link" to="/staffrecord">
                Staff
              </Link>
              <Link className="nav-item nav-link" to="/archivedstaffrecord">
                Archived
              </Link>
              <Link className="nav-item nav-link" to="/createuser">
                Create user
              </Link>
              <Link className="nav-item nav-link" to="/leavereport">
                Reports
              </Link>
              <Link className="nav-item nav-link" to="/sicksheetrecord">
                Sick sheet
              </Link>
              <Link className="nav-item nav-link" to="/publicholiday">
                Public Holidays
              </Link>
              <Logout />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
