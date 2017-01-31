import React, { PropTypes, Component } from "react";
import { Link, browserHistory } from "react-router";
import { logoutUser } from "../actions/userlogout";

export default class Navs extends Component {
  userLogout(e) {
    e.preventDefault();
    this.props.dispatch(logoutUser());
    browserHistory.push("/");
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
          <Link className="navbar-brand" to="/">
            Leave management system
          </Link>
          {
            isAuthenticated && (
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
                </div>
              )
          }
        </div>
      </nav>
    );
  }
}

Navs.propTypes = { isAuthenticated: PropTypes.bool.isRequired };
