import React, { PropTypes, Component } from "react";
import { Link, browserHistory } from "react-router";
import { logoutAdmin } from "../actions/AdminLogout";

export default class Header extends Component {
  adminLogout(e) {
    e.preventDefault();
    this.props.dispatch(logoutAdmin());
    browserHistory.push("/");
  }

  render() {
    return (
      <nav className="navbar fixed-top navbar-toggleable-md">
        <div className="container">
          <button
            style={{ borderColor: "#66afe9" }}
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link className="navbar-brand" to="/">
            Leave management system
          </Link>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <div className="navbar-nav">
              <Link className="nav-item nav-link" to="/staffrecord">
                Staff record
              </Link>
              <Link className="nav-item nav-link" to="/approvedleave">
                Leave calendar
              </Link>
              <Link className="nav-item nav-link" to="/leavereport">
                Leave report
              </Link>
              <Link className="nav-item nav-link" to="/sicksheetrecord">
                Sick sheet record
              </Link>
              <Link className="nav-item nav-link" to="/newrecord">
                New record
              </Link>
              <Link className="nav-item nav-link" to="/archivedstaffrecord">
                Archived staff
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

Header.propTypes = { dispatch: PropTypes.func.isRequired };
