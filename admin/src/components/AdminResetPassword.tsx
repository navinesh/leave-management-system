import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

export default function AdminResetPassword(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  function handleEmailChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Enter a valid email address!');
      return;
    }

    setErrorMessage('');
    setServerMessage('');

    resetPassword();
  }

  async function resetPassword(): Promise<any> {
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/admin-reset-password',
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
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              serverMessage
            )}
            {errorMessage}
          </div>
        </div>
        <div className="card card-body mt-3">
          <Link to="/" className="btn text-primary">
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
