import React from 'react'
import { connect } from 'react-redux'
import Navs from '../components/header'

const Header = ({ isAuthenticated, dispatch, children }) => {
  return (
    <div className="Header">
      <Navs
        isAuthenticated={isAuthenticated}
        dispatch={dispatch} />
      {children}
    </div>
  )
}

const mapStateToProps = (state) => {
  const { userAuth } = state
  const { isAuthenticated } = userAuth

  return { isAuthenticated }
}

export default connect(mapStateToProps)(Header)
