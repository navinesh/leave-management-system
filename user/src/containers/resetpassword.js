import React from 'react'
import { connect } from 'react-redux'
import UserResetPassword from '../components/resetpassword'
import { resetPassword } from '../actions/resetpassword'

const ResetPassword = ({ dispatch, isAuthenticated, message, isFetching  }) => {
  return (
    <div className="ResetPassword">
      {!isAuthenticated &&
        <div className="row">
          <div className="col-xs-12 col-sm-4 offset-sm-4 pt-3">
            <UserResetPassword
            isFetching={isFetching}
            message={message}
            onResetClick={ email => dispatch(resetPassword(email)) } />
          </div>
        </div>
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  const { userAuth } = state
  const {
    isAuthenticated,
    isFetching,
  } = userAuth

  return {
    isAuthenticated,
    isFetching
  }
}

export default connect(mapStateToProps)(ResetPassword)
