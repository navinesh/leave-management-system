// @flow
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
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

// type State = {
//   email: string,
//   password: string,
//   errorMessage: string
// };

function Login(props: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleEmailChange({ target }: SyntheticInputEvent<>) {
    setEmail(target.value);
  }

  function handlePasswordChange({ target }: SyntheticInputEvent<>) {
    setPassword(target.value);
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (!email && !password) {
      setErrorMessage(
        'The username you entered does not belong to any account. Please check your username and try again.'
      );
      return;
    }

    if (!email && password) {
      setErrorMessage(
        'The username you entered does not belong to any account. Please check your username and try again.'
      );
      return;
    }

    if (email && !password) {
      setErrorMessage(
        'Sorry, your password was incorrect. Please double-check your password.'
      );
      return;
    }

    setErrorMessage('');

    authenticateUser();
  }

  async function authenticateUser() {
    const { dispatch, logInUser } = props;

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
      setErrorMessage(error.message);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('id');
      dispatch(loginUserError());
    }
  }

  const { isFetching, message } = props;

  return (
    <>
      <div className="card card-body shadow p-3 mb-5 bg-white rounded">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
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
          {isFetching ? <div className="loader" /> : message}
          {errorMessage}
        </div>
      </div>
      <div className="card card-body mt-3">
        <Link to="/reset" className="btn">
          Forgot your password?
        </Link>
      </div>
    </>
  );
}

export default graphql(AUTHENTICATE_USER, { name: 'logInUser' })(Login);
