// @flow
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

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
  login: Function,
  loading: boolean,
  error: string
};

// type State = {
//   email: string,
//   password: string,
//   errorMessage: string
// };

function LoginForm(props: Props) {
  useEffect(function() {
    setErrorMessage(props.sessionError);
  }, []);

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

    props.login({ variables: { email: email, password: password } });
  }

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
          {props.loading && <div className="loader" />}
          {props.error && props.error.message}
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

export default function Login(props) {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={AUTHENTICATE_USER}
          update={(cache, data) => {
            localStorage.setItem(
              'user_id',
              data.data.authenticateUser.User.dbId
            );
            localStorage.setItem(
              'auth_token',
              data.data.authenticateUser.token
            );
            localStorage.setItem('id', data.data.authenticateUser.User.id);
            cache.writeData({
              data: {
                isAuthenticated: true,
                id: data.data.authenticateUser.User.id,
                auth_token: data.data.authenticateUser.token,
                sessionError: ''
              }
            });
          }}
        >
          {(login, { loading, error }) => {
            return (
              <LoginForm
                login={login}
                loading={loading}
                error={error}
                sessionError={props.sessionError}
              />
            );
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}
