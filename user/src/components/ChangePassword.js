// @flow
import React, { useState } from 'react';

import axios from 'axios';

type Props = {
  auth_token: string
};

// type State = {
//   errorMessage: string,
//   currentPassword: string,
//   newPassword: string,
//   newPasswordConfirm: string
// };

export default function UserChange(props: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleCurrentPasswordChange({ target }: SyntheticInputEvent<>) {
    setCurrentPassword(target.value);
  }

  function handlePasswordChange({ target }: SyntheticInputEvent<>) {
    setNewPassword(target.value);
  }

  function handlePasswordChangeConfirm({ target }: SyntheticInputEvent<>) {
    setNewPasswordConfirm(target.value);
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setErrorMessage('One or more required fields are missing!');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMessage('Your new passwords do not match!');
      return;
    }

    if (
      !newPassword.match(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
      )
    ) {
      setErrorMessage('Password does not meet complexity requirements!');
      return;
    }

    setErrorMessage('');
    setServerMessage('');

    changePassword();
  }

  async function changePassword() {
    setLoading(true);

    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8000/change-password',
        auth: { username: props.auth_token },
        data: {
          oldPassword: currentPassword,
          newPassword: newPassword
        }
      });

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data.message);
      } else {
        setServerMessage(response.data.message);
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirm('');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="col-md-3 ml-auto mr-auto">
      <div className="card card-body shadow p-3 mb-5 bg-white rounded">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Current password"
              id="currentPassword"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New password</label>
            <input
              type="password"
              className="form-control"
              placeholder="New password"
              id="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPasswordConfirm">Confirm new password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              id="newPasswordConfirm"
              value={newPasswordConfirm}
              onChange={handlePasswordChangeConfirm}
            />
            <small className="text-muted">
              Password must meet complexity requirements:
              <ul>
                <li>English uppercase characters (A through Z)</li>
                <li>English lowercase characters (a through z)</li>
                <li>Numerals (0 through 9)</li>
                <li>Non-alphabetic characters (such as !, $, #, %)</li>
                <li>More than 8 characters</li>
              </ul>
            </small>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary col">
              Update password
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
