// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  isAuthenticated: boolean,
  dispatch: Function,
  logoutUser: Function
};

export default class Navs extends Component<Props> {
  userLogout: Function;

  constructor() {
    super();
    this.userLogout = this.userLogout.bind(this);
  }

  userLogout(e: Event) {
    this.props.dispatch(this.props.logoutUser());
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
          {this.props.isAuthenticated && (
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
                  <button
                    onClick={this.userLogout}
                    className="btn btn-primary ml-2"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }
}
