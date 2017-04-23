// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { logoutAdmin } from '../actions/AdminLogout';

export default class Header extends Component {
  props: { dispatch: Function };

  adminLogout(e: Event) {
    e.preventDefault();
    this.props.dispatch(logoutAdmin());
  }

  render() {
    return (
      <nav className="navbar fixed-top navbar-toggleable-md">
        <div className="container">
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <Link className="navbar-brand" to="/" style={{ color: '#707070' }}>
            Leave Management System
          </Link>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <div className="navbar-nav">
              <Link className="nav-item nav-link" to="/staffrecord">
                Staff
              </Link>
              <Link className="nav-item nav-link" to="/approvedleave">
                Calendar
              </Link>
              <Link className="nav-item nav-link" to="/leavereport">
                Report
              </Link>
              <Link className="nav-item nav-link" to="/sicksheetrecord">
                Sick sheet
              </Link>
              <Link className="nav-item nav-link" to="/newrecord">
                New
              </Link>
              <Link className="nav-item nav-link" to="/archivedstaffrecord">
                Archived
              </Link>
              <Link className="nav-item nav-link" to="/publicholiday">
                Public Holidays
              </Link>
              <button
                onClick={this.adminLogout.bind(this)}
                className="btn btn-primary ml-1"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
