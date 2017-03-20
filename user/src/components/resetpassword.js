import React, { Component, PropTypes } from "react";
var Loader = require("halogen/ClipLoader");

export default class UserResetPassword extends Component {
  constructor() {
    super();
    this.state = { errorMessage: null };
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email ? this.state.email.trim() : null;

    if (!email) {
      this.setState({ errorMessage: "Enter a valid email address!" });
      return;
    }

    this.props.onResetClick(email);
  }

  render() {
    return (
      <div className="card card-block" style={{ marginTop: "100px" }}>
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
          {this.props.isFetching
            ? <Loader color="#0275d8" size="20px" />
            : this.props.message}
          {this.state.errorMessage}
        </div>
      </div>
    );
  }
}

UserResetPassword.propTypes = {
  onResetClick: PropTypes.func.isRequired,
  message: PropTypes.string,
  isFetching: PropTypes.bool.isRequired
};
