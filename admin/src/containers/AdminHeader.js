import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/AdminHeader'
import AdminLogin from './AdminLogin'
import { logoutAdmin } from '../actions/AdminLogout'

const AdminHeader = ({ isAuthenticated, dispatch, children }) =>
  <div className="AdminHeader">
    {isAuthenticated &&
      <Header
      onLogoutClick={() => dispatch(logoutAdmin())} />
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

const mapStateToProps = (state) => {
  const { adminAuth } = state
  const { isAuthenticated } = adminAuth

  return { isAuthenticated }
}

export default connect(mapStateToProps)(AdminHeader)
