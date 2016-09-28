import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/AdminHeader'
import { logoutAdmin } from '../actions/AdminLogout'

const AdminHeader = ({ isAuthenticated, dispatch, children }) => {
  return (
    <Header
      isAuthenticated={isAuthenticated}
      onLogoutClick={() => dispatch(logoutAdmin())}
      children={children} />
  )
}

const mapStateToProps = (state) => {
  const { adminAuth } = state
  const { isAuthenticated } = adminAuth

  return { isAuthenticated }
}

export default connect(mapStateToProps)(AdminHeader)
