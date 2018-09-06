// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  dispatch: Function,
  logoutAdmin: Function
};

export default class Header extends Component<Props> {
  adminLogout: Function;

  constructor() {
    super();
    this.adminLogout = this.adminLogout.bind(this);
  }

  adminLogout(e: Event) {
    this.props.dispatch(this.props.logoutAdmin());
  }

  render() {
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
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
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
                <Link className="nav-item nav-link" to="/newrecord">
                  New
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
                <button
                  onClick={this.adminLogout}
                  className="btn btn-primary ml-1"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
