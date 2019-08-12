import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { ApolloError } from 'apollo-client';

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

interface FormProps {
  login: Function;
  loading: boolean;
  error: ApolloError | undefined;
  sessionError: string;
}

function LoginForm(props: FormProps): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect((): void => {
    setErrorMessage(props.sessionError);
  }, [props.sessionError]);

  function handleEmailChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(target.value);
  }

  function handlePasswordChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
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
              autoComplete="email"
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
              autoComplete="password"
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
          {props.loading && (
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {props.error && props.error.message}
          {errorMessage}
        </div>
      </div>
      <div className="card card-body mt-3">
        <Link to="/reset" className="btn text-primary">
          Forgot your password?
        </Link>
      </div>
    </>
  );
}

interface Props {
  sessionError: string;
}

export default function Login(props: Props): JSX.Element {
  const [login, { loading, error }] = useMutation(AUTHENTICATE_USER, {
    update(cache: any, data: any) {
      localStorage.setItem('id', data.data.authenticateUser.User.id);
      localStorage.setItem('auth_token', data.data.authenticateUser.token);
      cache.writeData({
        data: {
          isAuthenticated: true,
          id: data.data.authenticateUser.User.id,
          auth_token: data.data.authenticateUser.token,
          sessionError: ''
        }
      });
    }
  });

  return (
    <LoginForm
      login={login}
      loading={loading}
      error={error}
      sessionError={props.sessionError}
    />
  );
}
