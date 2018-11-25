//  @flow
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  onResetClick: Function,
  message: string,
  isFetching: boolean
};

// type State = {
//   errorMessage: string,
//   email: string
// };

export default function AdminResetPassword(props: Props) {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleEmailChange({ target }: SyntheticInputEvent<>) {
    setEmail(target.value);
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Enter a valid email address!');
      return;
    }

    props.onResetClick(email);
  }

  const { isFetching, message } = props;

  return (
    <>
      <h1 className="display-4 text-center pb-4">Leave Management System</h1>
      <div className="col-3 ml-auto mr-auto">
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
              <button type="submit" className="btn btn-primary col">
                Reset
              </button>
            </div>
          </form>
          <div className="text-danger text-center">
            {isFetching ? <div className="loader" /> : message}
            {errorMessage}
          </div>
        </div>
        <div className="card card-body mt-3">
          <Link to="/" className="btn">
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
