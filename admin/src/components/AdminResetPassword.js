//  @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  onResetClick: Function,
  message: string,
  isFetching: boolean
};

type State = {
  errorMessage: string,
  email: string
};

export default class AdminResetPassword extends Component<Props, State> {
  constructor() {
    super();
    this.state = { errorMessage: '', email: '' };
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

    this.props.onResetClick(email);
  }

  render() {
    return (
      <div className="AdminResetPassword">
        <h1 className="display-4 text-center pb-4">Leave Management System</h1>
        <div className="col-4 ml-auto mr-auto">
          <div className="card card-body">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  id="email"
                  onChange={this.handleEmailChange.bind(this)}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary col">
                  Reset
                </button>
              </div>
            </form>
            <div className="text-danger text-center">
              {this.props.isFetching ? (
                <div className="loader" />
              ) : (
                this.props.message
              )}
              {this.state.errorMessage}
            </div>
          </div>
          <div className="card card-body mt-3">
            <Link to="/" className="btn">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
