// @flow
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

import {
  requestAdminLogin,
  receiveAdminLogin,
  loginAdminError
} from '../actions/AdminLogin';

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
  isFetching: boolean,
  message: string,
  dispatch: Function
};

// type State = {
//   errorMessage: string,
//   email: string,
//   password: string
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

    if (!email || !password) {
      setErrorMessage('One or more required fields are missing!');
      return;
    }

    setErrorMessage('');

    authenticateAdmin();
  }

  async function authenticateAdmin() {
    const { logInAdmin, dispatch } = props;

    try {
      dispatch(requestAdminLogin());
      const response = await logInAdmin({
        variables: { email, password }
      });
      localStorage.setItem(
        'admin_token',
        response.data.authenticateAdmin.token
      );
      localStorage.setItem(
        'admin_user',
        response.data.authenticateAdmin.Admin.othernames
      );
      dispatch(receiveAdminLogin(response.data.authenticateAdmin));
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      dispatch(loginAdminError());
    }
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
            {props.isFetching ? <div className="loader" /> : props.message}
          </div>
          <div className="text-danger text-center">
            <div>{errorMessage}</div>
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

export default graphql(AUTHENTICATE_ADMIN, {
  name: 'logInAdmin'
})(Login);
