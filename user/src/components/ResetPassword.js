// @flow
import React, { useState } from 'react';

import axios from 'axios';

import '../spinners.css';

// type State = {
//   errorMessage: string,
//   email: string
// };

export default function UserResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
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
    setServerMessage('');

    resetPassword();
  }

  async function resetPassword() {
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/user-reset-password',
        {
          email: email
        }
      );

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data.message);
      } else {
        setServerMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

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
          {loading ? <div className="loader" /> : serverMessage}
        </div>
        <div className="text-danger text-center">
          <div>{errorMessage}</div>
        </div>
      </div>
    </div>
  );
}
