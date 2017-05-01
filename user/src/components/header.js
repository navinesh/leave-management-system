// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { logoutUser } from '../actions/UserLogout';

export default class Navs extends Component {
  props: {
    isAuthenticated: boolean,
    dispatch: Function
  };

  userLogout(e: Event) {
    e.preventDefault();
    this.props.dispatch(logoutUser());
  }

  render() {
    const { isAuthenticated } = this.props;

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
          {isAuthenticated &&
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <Link className="nav-item nav-link" to="/leaveapplication">
                Leave application
              </Link>
              <Link className="nav-item nav-link" to="/leavecalendar">
                Leave calendar
              </Link>
              <button
                onClick={this.userLogout.bind(this)}
                className="btn btn-primary ml-2"
              >
                Sign out
              </button>
            </div>}
        </div>
      </nav>
    );
  }
}
