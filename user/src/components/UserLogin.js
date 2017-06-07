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

  state: {
    email: string,
    password: string,
    errorMessage: string
  };

  constructor() {
    super();
    this.state = { email: '', password: '', errorMessage: '' };
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

    if (!email && !password) {
      this.setState({
        errorMessage:
          'The username you entered does not belong to an account. Please check your username and try again.'
      });
      return;
    }

    if (!email && password) {
      this.setState({
        errorMessage:
          'The username you entered does not belong to an account. Please check your username and try again.'
      });
      return;
    }

    if (email && !password) {
      this.setState({
        errorMessage:
          'Sorry, your password was incorrect. Please double-check your password.'
      });
      return;
    }

    this.setState({
      errorMessage: ''
    });

    const creds = { email: email, password: password };
    this.props.onLoginClick(creds);
  }

  render() {
    return (
      <div className="Login" style={{ marginTop: '80px' }}>
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
              ? <div className="loader" />
              : this.props.message}
            {this.state.errorMessage}
          </div>
        </div>
        <div className="card card-block mt-3">
          <Link to="/reset" className="btn">Forgot your password?</Link>
        </div>
      </div>
    );
  }
}
