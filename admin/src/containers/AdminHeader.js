import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/AdminHeader'
import AdminLogin from './AdminLogin'

const AdminHeader = ({ isAuthenticated, dispatch }) =>
  <div className="AdminHeader">
    {
      isAuthenticated ?
      <Header dispatch={dispatch} /> :
      <div>
        <h1 className="display-4 text-xs-center pb-3">
          Leave Management System
        </h1>
      <AdminLogin />
      </div>
    }
  </div>

const mapStateToProps = (state) => {
  const { adminAuth } = state
  const { isAuthenticated } = adminAuth

  return { isAuthenticated }
}

export default connect(mapStateToProps)(AdminHeader)
