import React, { Component, PropTypes } from 'react'
var Loader = require('halogen/ClipLoader');

export default class UserResetPassword extends Component {
  handleEmailChange (e) {
    this.setState({email: e.target.value});
  }

  handleSubmit (e) {
    e.preventDefault();
    const email = this.state.email.trim();

    if (!email) {
      return;
    }

    this.props.onResetClick(email)
  }

  render(){
    return(
      <div className="card card-block">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label for="email">Email address</label>
            <input type="email" className="form-control"
              placeholder="Enter email" id="email"
              onChange={this.handleEmailChange.bind(this)} />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary col-xs-12 col-sm-12">Reset</button>
          </div>
        </form>
        <div className="text-danger text-xs-center">
          {this.props.isFetching ?
            <Loader color="#0275d8" size="20px" />:
            this.props.message}
        </div>
      </div>

    )
  }
}

UserResetPassword.propTypes = {
  onResetClick: PropTypes.func.isRequired,
  message: PropTypes.string,
  isFetching: PropTypes.bool.isRequired
}
