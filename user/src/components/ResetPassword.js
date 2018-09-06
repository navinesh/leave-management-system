// @flow
import React, { Component } from 'react';

import '../spinners.css';
import { clearResetPasswordMessage } from '../actions/ResetPassword';

type Props = {
  onResetClick: Function,
  message: string,
  isFetching: boolean,
  dispatch: Function
};

type State = {
  errorMessage: string,
  email: string
};

export default class UserResetPassword extends Component<Props, State> {
  handleEmailChange: Function;
  handleSubmit: Function;

  constructor() {
    super();
    this.state = { errorMessage: '', email: '' };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(clearResetPasswordMessage());
  }

  handleEmailChange({ target }: SyntheticInputEvent<>) {
    this.setState({ email: target.value });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const email = this.state.email ? this.state.email.trim() : null;

    if (!email) {
      this.setState({ errorMessage: 'Enter a valid email address!' });
      return;
    }

    this.setState({ email: '' });

    this.props.onResetClick(email);
  }

  render() {
    return (
      <div className="col-md-5 ml-auto mr-auto">
        <div className="card card-body shadow p-3 mb-5 bg-white rounded">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                id="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary col">
                Reset
              </button>
            </div>
          </form>
          <div className="text-primary text-center">
            {this.props.isFetching ? (
              <div className="loader1" />
            ) : (
              this.props.message
            )}
            {this.state.errorMessage}
          </div>
        </div>
      </div>
    );
  }
}
