import React from 'react'
import { connect } from 'react-redux'
import UserLoginBox from './userlogincontainer'

const MainUserLoginBox = ({ isAuthenticated }) => {
  return (
    <div className="MainView">
      {!isAuthenticated &&
        <div className="row">
          <div className="col-xs-12 col-sm-4 offset-sm-4">
            <UserLoginBox />
          </div>
        </div>
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  const { userAuth } = state
  const { isAuthenticated } = userAuth

  return { isAuthenticated }
}

export default connect(mapStateToProps)(MainUserLoginBox)
