import React, { Component, PropTypes } from "react";
import { Link } from "react-router-dom";

var Loader = require("halogen/ClipLoader");

export default class Login extends Component {
  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email ? this.state.email.trim() : null;
    const password = this.state.password ? this.state.password.trim() : null;

    if (!email || !password) {
      return;
    }

    const creds = { email: email, password: password };
    this.props.onLoginClick(creds);
  }

  render() {
    return (
      <div className="Login" style={{ marginTop: "80px" }}>
        <div className="card card-block">
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                id="email"
                onChange={this.handleEmailChange.bind(this)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                id="password"
                onChange={this.handlePasswordChange.bind(this)}
              />
              <small className="text-muted">
                Enter your leave management system password.
              </small>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary col">
                Log in
              </button>
            </div>
          </form>
          <div className="text-danger text-center">
            {this.props.isFetching
              ? <Loader color="#0275d8" size="20px" />
              : this.props.message}
          </div>
        </div>
        <div className="card card-block mt-3">
          <Link to="/reset" className="btn">Forgot your password?</Link>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  message: PropTypes.string,
  isFetching: PropTypes.bool.isRequired
};
