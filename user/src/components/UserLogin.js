// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import {
  requestUserLogin,
  receiveUserLogin,
  loginUserError
} from '../actions/UserLogin';

import '../spinners.css';

const AUTHENTICATE_USER = gql`
  mutation authenticateUser($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      User {
        id
        dbId
      }
      token
      ok
    }
  }
`;

type Props = {
  logInUser: Function,
  message: string,
  isFetching: boolean,
  dispatch: Function
};

type State = {
  email: string,
  password: string,
  errorMessage: string
};

class Login extends Component<Props, State> {
  handleEmailChange: Function;
  handlePasswordChange: Function;
  handleSubmit: Function;

  constructor() {
    super();
    this.state = { email: '', password: '', errorMessage: '' };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange({ target }: SyntheticInputEvent<>) {
    this.setState({ email: target.value });
  }

  handlePasswordChange({ target }: SyntheticInputEvent<>) {
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

    this.authenticateUser();
  }

  authenticateUser = async () => {
    const { logInUser, dispatch } = this.props;
    const { email, password } = this.state;

    try {
      dispatch(requestUserLogin());
      const response = await logInUser({
        variables: { email, password }
      });
      localStorage.setItem('auth_token', response.data.authenticateUser.token);
      localStorage.setItem('user_id', response.data.authenticateUser.User.dbId);
      localStorage.setItem('id', response.data.authenticateUser.User.id);
      const auth_info = {
        auth_token: response.data.authenticateUser.token,
        user_id: response.data.authenticateUser.User.dbId,
        id: response.data.authenticateUser.User.id
      };
      dispatch(receiveUserLogin(auth_info));
    } catch (error) {
      console.log(error);
      this.setState({ errorMessage: error.message });
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('id');
      dispatch(loginUserError());
    }
  };

  render() {
    return (
      <div className="Login" style={{ marginTop: '80px' }}>
        <div className="card card-body">
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
            {this.props.isFetching ? (
              <div className="loader" />
            ) : (
              this.props.message
            )}
            {this.state.errorMessage}
          </div>
        </div>
        <div className="card card-body mt-3">
          <Link to="/reset" className="btn">
            Forgot your password?
          </Link>
        </div>
      </div>
    );
  }
}

export default graphql(AUTHENTICATE_USER, { name: 'logInUser' })(Login);
