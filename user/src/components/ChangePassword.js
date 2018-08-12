// @flow
import React, { Component } from 'react';

import '../spinners.css';
import { clearChangePasswordError } from '../actions/ChangePassword';

type Props = {
  dispatch: Function,
  onChangeClick: Function,
  message: string,
  isFetching: boolean,
  auth_info: Object
};

type State = {
  errorMessage: string,
  currentPassword: string,
  newPassword: string,
  newPasswordConfirm: string
};

export default class UserChange extends Component<Props, State> {
  handleCurrentPasswordChange: Function;
  handlePasswordChange: Function;
  handlePasswordChangeConfirm: Function;
  handleSubmit: Function;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    };

    this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(
      this
    );
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordChangeConfirm = this.handlePasswordChangeConfirm.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCurrentPasswordChange({ target }: SyntheticInputEvent<>) {
    this.setState({ currentPassword: target.value });
  }

  handlePasswordChange({ target }: SyntheticInputEvent<>) {
    this.setState({ newPassword: target.value });
  }

  handlePasswordChangeConfirm({ target }: SyntheticInputEvent<>) {
    this.setState({ newPasswordConfirm: target.value });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    this.setState({ errorMessage: '' });
    this.props.dispatch(clearChangePasswordError());

    let auth_token = this.props.auth_info.auth_token;
    if (!auth_token) {
      auth_token = localStorage.getItem('auth_token');
    }

    const currentPassword = this.state.currentPassword
      ? this.state.currentPassword.trim()
      : null;
    const newPassword = this.state.newPassword
      ? this.state.newPassword.trim()
      : null;
    const newPasswordConfirm = this.state.newPasswordConfirm
      ? this.state.newPasswordConfirm.trim()
      : null;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      this.setState({
        errorMessage: 'One or more required fields are missing!'
      });
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      this.setState({ errorMessage: 'Your new passwords do not match!' });
      return;
    }

    if (
      !newPassword.match(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
      )
    ) {
      this.setState({
        errorMessage: 'Password does not meet complexity requirements!'
      });
      return;
    }

    this.setState({
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    });

    const creds = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      auth_token: auth_token
    };

    this.props.onChangeClick(creds);
  }

  render() {
    return (
      <div className="col-md-3 ml-auto mr-auto">
        <div className="card card-body shadow p-3 mb-5 bg-white rounded">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Current password"
                id="currentPassword"
                value={this.state.currentPassword}
                onChange={this.handleCurrentPasswordChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New password</label>
              <input
                type="password"
                className="form-control"
                placeholder="New password"
                id="newPassword"
                value={this.state.newPassword}
                onChange={this.handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPasswordConfirm">Confirm new password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                id="newPasswordConfirm"
                value={this.state.newPasswordConfirm}
                onChange={this.handlePasswordChangeConfirm}
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
            {this.props.isFetching ? (
              <div className="loader" />
            ) : (
              this.props.message
            )}
          </div>
          <div className="text-danger text-center">
            <div>{this.state.errorMessage}</div>
          </div>
        </div>
      </div>
    );
  }
}
