//  @flow
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

// type State = {
//   errorMessage: string,
//   email: string
// };

export default function AdminResetPassword(props: Props) {
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
        'http://localhost:8000/admin-reset-password',
        {
          email: email
        }
      );

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data.message);
      } else {
        setServerMessage(response.data.message);
        setEmail('');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <h1 className="display-4 text-center pb-4">Leave Management System</h1>
      <div className="col-5 ml-auto mr-auto">
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
            {loading ? <div className="loader" /> : serverMessage}
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
