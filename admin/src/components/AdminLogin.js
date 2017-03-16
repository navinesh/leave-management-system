import React, { Component, PropTypes } from "react";
import { Link } from "react-router-dom";

var Loader = require("halogen/ClipLoader");

export default class Login extends Component {
  constructor() {
    super();
    this.state = { errorMessage: "" };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

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
      this.setState({
        errorMessage: "One or more required fields are missing!"
      });

      return;
    }

    this.setState({ errorMessage: "" });

    const creds = { email: email, password: password };
    this.props.onLoginClick(creds);
  }

  render() {
    const { isFetching, message } = this.props;

    return (
      <div className="col-md-4 offset-md-4">
        <div className="card card-block">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                id="email"
                onChange={this.handleEmailChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                id="password"
                onChange={this.handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary col">
                Log in
              </button>
            </div>
          </form>
          <div className="text-danger text-center">
            {isFetching ? <Loader color="#0275d8" size="20px" /> : message}
          </div>
          <div className="text-danger text-center">
            <div>{this.state.errorMessage}</div>
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
