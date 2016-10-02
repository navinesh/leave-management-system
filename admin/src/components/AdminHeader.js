import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const Header = ({ onLogoutClick }) => {
  return (
    <div className="Navs">
      <nav className="navbar navbar-fixed-top">
        <div className="container">
          <div className="nav navbar-nav">
            <Link className="nav-item nav-link" to="/">
              LMS - dashboard
            </Link>
            <div className="pull-xs-right">
              <Link className="nav-item nav-link" to="/">
                Staff record
              </Link>
              <Link className="nav-item nav-link" to="/approvedleave">
                Leave calendar
              </Link>
              <Link className="nav-item nav-link" to="/">
                Leave report
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
    </div>
  )
}

Header.propTypes = {
  onLogoutClick: PropTypes.func.isRequired
}

export default Header
