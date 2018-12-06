// @flow
import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Mutation, ApolloConsumer } from 'react-apollo';
import { Link } from 'react-router-dom';

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

type Props = {
  logInAdmin: Function,
  loading: boolean,
  error: string,
  sessionError: string
};

// type State = {
//   errorMessage: string,
//   email: string,
//   password: string
// };

function LoginForm(props: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(function() {
    setErrorMessage(props.sessionError);
  }, []);

  function handleEmailChange({ target }: SyntheticInputEvent<>) {
    setEmail(target.value);
  }

  function handlePasswordChange({ target }: SyntheticInputEvent<>) {
    setPassword(target.value);
  }

  function handleSubmit(e: Event) {
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
          <Link to="/resetpassword" className="btn">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Login(props) {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={AUTHENTICATE_ADMIN}
          update={(cache, data) => {
            localStorage.setItem(
              'admin_user',
              data.data.authenticateAdmin.Admin.othernames
            );
            localStorage.setItem(
              'admin_token',
              data.data.authenticateAdmin.token
            );
            cache.writeData({
              data: {
                isAuthenticated: true,
                admin_user: data.data.authenticateAdmin.Admin.othernames,
                admin_token: data.data.authenticateAdmin.token,
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
