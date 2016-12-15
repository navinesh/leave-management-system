import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchUserDetailsIfNeeded } from '../actions/userdetails'
import { fetchLeaveApplication } from '../actions/leaveapplication'
import LeaveApplications from '../components/leaveapplication'

class LeaveApplication extends Component {
  componentDidMount() {
    const { dispatch, auth_info } = this.props
    let auth_token = auth_info.auth_token;
    if(auth_token) {
      dispatch(fetchUserDetailsIfNeeded(auth_token))
    }
    else {
      auth_token= localStorage.getItem('auth_token')
      if(auth_token) {
        dispatch(fetchUserDetailsIfNeeded(auth_token))
      }
    }
  }

  render() {
    const { dispatch, message, isAuthenticated, isFetching, user_detail } = this.props
    return (
      <div className="LeaveApplication">
        {isAuthenticated &&
          <LeaveApplications
          isFetching={isFetching}
          message={message}
          user_detail={user_detail}
          onLeaveApplicationClick={ applicationDetails => dispatch(fetchLeaveApplication(applicationDetails)) } />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { userAuth, leaveApplication, userDetails } = state
  const { isAuthenticated, auth_info } = userAuth
  const { isFetching, message } = leaveApplication
  const { userDetail: user_detail } = userDetails

  return {
    message,
    isAuthenticated,
    isFetching,
    auth_info,
    user_detail
  }
}

export default connect(mapStateToProps)(LeaveApplication)
