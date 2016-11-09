import React, { Component } from 'react'
import { connect } from 'react-redux'
import NewRecordForm from '../components/NewRecord'
import { submitNewUserRecord } from '../actions/NewRecord'

class NewRecord extends Component {
  render() {
    const { dispatch, message, isAuthenticated, isFetching } = this.props
    return (
      <div className="NewRecord">
        {isAuthenticated &&
          <NewRecordForm
          isFetching={isFetching}
          message={message}
          onNewUserRecordSubmit={ newUserDetails => dispatch(submitNewUserRecord(newUserDetails)) }
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { adminAuth, addUser } = state
  const { isAuthenticated } = adminAuth
  const { isFetching, message } = addUser

  return {
    isAuthenticated,
    isFetching,
    message
  }
}

export default connect(mapStateToProps)(NewRecord)
