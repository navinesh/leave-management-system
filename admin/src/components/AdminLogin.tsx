import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { ApolloError } from 'apollo-client';

const AUTHENTICATE_ADMIN = gql`
  mutation authenticateAdmin($email: String!, $password: String!) {
    authenticateAdmin(email: $email, password: $password) {
      Admin {
        othernames
      }
      token
      ok
    }
  }
`;

interface LoginProps {
  login: Function;
  loading: boolean;
  error: ApolloError | undefined;
  sessionError: string;
}

function LoginForm(props: LoginProps): JSX.Element {
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

    if (!email || !password) {
      setErrorMessage('One or more required fields are missing!');
      return;
    }

    setErrorMessage('');

    props.login({ variables: { email: email, password: password } });
  }

  return (
    <div className="container">
      <h1 className="display-4 text-center pb-4">Leave Management System</h1>
      <div className="col-md-5 mx-auto">
        <div className="card card-body">
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
          <Link to="/resetpassword" className="btn text-primary">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}

interface Props {
  sessionError: string;
}

export default function Login(props: Props): JSX.Element {
  const [login, { loading, error }] = useMutation(AUTHENTICATE_ADMIN, {
    update(cache: any, data: any) {
      localStorage.setItem(
        'admin_user',
        data.data.authenticateAdmin.Admin.othernames
      );
      localStorage.setItem('admin_token', data.data.authenticateAdmin.token);
      cache.writeData({
        data: {
          isAuthenticated: true,
          admin_user: data.data.authenticateAdmin.Admin.othernames,
          admin_token: data.data.authenticateAdmin.token,
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
