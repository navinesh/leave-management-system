import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const Navs = ({ isAuthenticated, onLogoutClick, children }) => {
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
              <div className="pull-xs-right">
                <Link className="nav-item nav-link" to="/leaveapplication">
                  Leave application
                </Link>
                <Link className="nav-item nav-link" to="/leavecalendar">
                  Leave calendar
                </Link>
                <button onClick={() => onLogoutClick()} className="btn btn-primary m-l-1">
                  Sign out
                </button>
              </div>
            </div>
          }
        </div>
      </nav>
      {children}
    </div>
  )
}

Navs.propTypes = {
  onLogoutClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
}

export default Navs
