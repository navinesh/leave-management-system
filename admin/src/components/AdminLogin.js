// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../spinners.css';

export default class Login extends Component {
  props: {
    onLoginClick: Function,
    message: string,
    isFetching: boolean
  };

  state: { errorMessage: string, email: string, password: string };

  handleSubmit: Function;
  handleEmailChange: Function;
  handlePasswordChange: Function;

  constructor() {
    super();
    this.state = { errorMessage: '', email: '', password: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange({ target }: SyntheticInputEvent) {
    this.setState({ email: target.value });
  }

  handlePasswordChange({ target }: SyntheticInputEvent) {
    this.setState({ password: target.value });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const email = this.state.email ? this.state.email.trim() : null;
    const password = this.state.password ? this.state.password.trim() : null;

    if (!email || !password) {
      this.setState({
        errorMessage: 'One or more required fields are missing!'
      });

      return;
    }

    this.setState({ errorMessage: '' });

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
            {isFetching ? <div className="loader" /> : message}
          </div>
          <div className="text-danger text-center">
            <div>
              {this.state.errorMessage}
            </div>
          </div>
        </div>
        <div className="card card-block mt-3">
          <Link to="/resetpassword" className="btn">
            Forgot your password?
          </Link>
        </div>
      </div>
    );
  }
}
