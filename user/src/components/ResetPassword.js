// @flow
import React, { useState, useEffect } from 'react';

import '../spinners.css';
import { clearResetPasswordMessage } from '../actions/ResetPassword';

type Props = {
  onResetClick: Function,
  message: string,
  isFetching: boolean,
  dispatch: Function
};

// type State = {
//   errorMessage: string,
//   email: string
// };

export default function UserResetPassword(props: Props) {
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

    setErrorMessage('');

    props.onResetClick(email);
  }

  useEffect(
    function() {
      return function() {
        props.dispatch(clearResetPasswordMessage());
      };
    },
    [errorMessage]
  );

  const { isFetching, message } = props;

  return (
    <div className="col-md-5 ml-auto mr-auto">
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
            <button type="submit" className="btn btn-primary col">
              Reset
            </button>
          </div>
        </form>
        <div className="text-primary text-center">
          {isFetching ? <div className="loader1" /> : message}
          {errorMessage}
        </div>
      </div>
    </div>
  );
}
