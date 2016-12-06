import React from 'react'
import { Link } from 'react-router'

export default () =>
  <nav className="nav nav-pills nav-stacked">
    <Link className="nav-link" to="/">
        Dashboard
    </Link>
    <Link className="nav-link" to="/staffrecord">
        Staff record
    </Link>
    <Link className="nav-link" to="/approvedleave">
      Leave calendar
    </Link>
    <Link className="nav-link" to="/leavereport">
      Leave report
    </Link>
    <Link className="nav-link" to="/sicksheetrecord">
      Sick sheet record
    </Link>
    <Link className="nav-link" to="/archivedstaffrecord">
      Archived staff
    </Link>
    <Link className="nav-link" to="/newrecord">
      New record
    </Link>
  </nav>
