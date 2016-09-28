import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
//var Loader = require('halogen/ClipLoader');

export default class Login extends Component {
  constructor() {
    super()
    this.state = {
      errorMessage: ''
    }
  }

  handleEmailChange (e) {
    this.setState({email: e.target.value})
  }

  handlePasswordChange (e) {
    this.setState({password: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault()
    const email = this.state.email ? this.state.email.trim() : null;
    const password = this.state.password ? this.state.password.trim() : null;

    if (!email || !password) {
      this.setState({errorMessage: 'One or more required fields are missing!'})
      return;
    }

    const creds = { email: email, password: password }
    this.props.onLoginClick(creds)
  }

  render(){
    return(
      <div className="col-xs-12 col-sm-4 offset-sm-4">
        <div className="card card-block">
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control"
                placeholder="Enter email" id="email"
                onChange={this.handleEmailChange.bind(this)} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control"
                placeholder="Password" id="password"
                onChange={this.handlePasswordChange.bind(this)} />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary col-xs-12 col-sm-12">Log in</button>
            </div>
          </form>
          <div className="text-danger text-xs-center p-t-3">
            {this.props.isFetching ?
              <div>Loading...</div>:
              this.props.message}
          </div>
          <div className="text-danger text-xs-center ">
            {this.state.errorMessage ?
              <div>{this.state.errorMessage}</div> :
                 ''}
          </div>
        </div>
        <Link to="/reset" className="btn col-xs-12 col-sm-12">Forgot your password?</Link>
      </div>
    )
  }
}

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  message: PropTypes.string,
  isFetching: PropTypes.bool.isRequired
}
