import React from 'react'
import { connect } from 'react-redux'
import Navs from '../components/header'
import { logoutUser } from '../actions/userlogout'

const Header = ({ isAuthenticated, dispatch, children }) => {
  return (
    <Navs
      isAuthenticated={isAuthenticated}
      onLogoutClick={() => dispatch(logoutUser())}
      children={children} />
  )
}

const mapStateToProps = (state) => {
  const { userAuth } = state
  const { isAuthenticated } = userAuth

  return { isAuthenticated }
}

export default connect(mapStateToProps)(Header)
