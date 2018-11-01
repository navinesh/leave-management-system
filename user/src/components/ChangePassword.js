// @flow
import React, { useState } from 'react';

import '../spinners.css';

type Props = {
  dispatch: Function,
  onChangeClick: Function,
  message: string,
  isFetching: boolean,
  auth_info: Object
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

    let auth_token = props.auth_info.auth_token;
    if (!auth_token) {
      auth_token = localStorage.getItem('auth_token');
    }

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

    const creds = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      auth_token: auth_token
    };

    props.onChangeClick(creds);
  }

  const { isFetching, message } = props;

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
          {isFetching ? <div className="loader" /> : message}
        </div>
        <div className="text-danger text-center">
          <div>{errorMessage}</div>
        </div>
      </div>
    </div>
  );
}
