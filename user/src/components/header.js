import React, { PropTypes, Component } from 'react'
import { Link, browserHistory } from 'react-router'
import { logoutUser } from '../actions/userlogout'

export default class Navs extends Component {
  userLogout(e) {
    e.preventDefault()
    this.props.dispatch(logoutUser())
    browserHistory.push('/')
  }

  render() {
    const { isAuthenticated } = this.props
    return (
      <div className="Navs">
        <nav className="navbar navbar-fixed-top">
          <div className="container">
            {!isAuthenticated &&
              <div className="nav navbar-nav">
                <Link className="nav-item nav-link" to="/">
                  Leave management system
                </Link>
              </div>
            }
            {isAuthenticated &&
              <div className="nav navbar-nav">
                <Link className="nav-item nav-link" to="/">
                  Leave management system
                </Link>
                <div className="float-xs-right">
                  <Link className="nav-item nav-link" to="/leaveapplication">
                    Leave application
                  </Link>
                  <Link className="nav-item nav-link" to="/leavecalendar">
                    Leave calendar
                  </Link>
                  <button onClick={this.userLogout.bind(this)} className="btn btn-primary ml-1">
                    Sign out
                  </button>
                </div>
              </div>
            }
          </div>
        </nav>
      </div>
    )
  }
}

Navs.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}
