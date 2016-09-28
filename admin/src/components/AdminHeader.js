import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import AdminLogin from '../containers/AdminLogin'

const Header = ({ isAuthenticated, onLogoutClick, children }) => {
  return (
    <div className="Navs">
      {isAuthenticated &&
        <nav className="navbar navbar-fixed-top">
          <div className="container">
            <div className="nav navbar-nav">
              <Link className="nav-item nav-link" to="/">
                Leave management system - admin
              </Link>
              <div className="pull-xs-right">
                <Link className="nav-item nav-link" to="/">
                  Staff record
                </Link>
                <Link className="nav-item nav-link" to="/approvedleave">
                  Leave calendar
                </Link>
                <Link className="nav-item nav-link" to="/">
                  Leave record
                </Link>
                <Link className="nav-item nav-link" to="/">
                  Sick sheet record
                </Link>
                <Link className="nav-item nav-link" to="/newrecord">
                  New record
                </Link>
                <Link className="nav-item nav-link" to="/">
                  Archived staff
                </Link>
                <button onClick={() => onLogoutClick()} className="btn btn-primary m-l-1">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>
      }
      {!isAuthenticated &&
        <div>
          <h1 className="display-4 text-xs-center p-b-3">
            Leave Management System
          </h1>
        <AdminLogin />
        </div>
      }
      {children}
    </div>
  )
}

Header.propTypes = {
  onLogoutClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
}

export default Header
