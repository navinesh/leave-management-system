import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/Sidebar'

const AdminSidebar = ({ isAuthenticated }) =>
  <div className="AdminSidebar">
    {
      isAuthenticated &&
      <Sidebar />
    }
  </div>

const mapStateToProps = (state) => {
  const { adminAuth } = state
  const { isAuthenticated } = adminAuth

  return { isAuthenticated }
}

export default connect(mapStateToProps)(AdminSidebar)
