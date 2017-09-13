// @flow
import React, { Component } from 'react';

import '../spinners.css';

type Props = {
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
  handleNewPasswordChange: Function;
  handleNewPasswordConfirmChange: Function;
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
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.handleNewPasswordConfirmChange = this.handleNewPasswordConfirmChange.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCurrentPasswordChange({ target }: SyntheticInputEvent<>) {
    this.setState({ currentPassword: target.value });
  }

  handleNewPasswordChange({ target }: SyntheticInputEvent<>) {
    this.setState({ newPassword: target.value });
  }

  handleNewPasswordConfirmChange({ target }: SyntheticInputEvent<>) {
    this.setState({ newPasswordConfirm: target.value });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    this.setState({ errorMessage: '' });

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

    this.setState({ errorMessage: '' });

    const creds = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      auth_token: auth_token
    };
    this.props.onChangeClick(creds);
  }

  render() {
    return (
      <div className="col-md-4 ml-auto mr-auto" style={{ marginTop: '100px' }}>
        <div className="card card-body">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Current password"
                id="currentPassword"
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
                onChange={this.handleNewPasswordChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPasswordConfirm">Confirm new password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                id="newPasswordConfirm"
                onChange={this.handleNewPasswordConfirmChange}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary col">
                Update password
              </button>
            </div>
          </form>
          <div className="text-danger text-center">
            {this.props.isFetching
              ? <div className="loader" />
              : this.props.message}
          </div>
          <div className="text-danger text-center">
            <div>
              {this.state.errorMessage}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
