import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPendingLeave } from '../actions/PendingLeave'
import PendingLeaveList from '../components/PendingLeave'

const BeatLoader = require('halogen/BeatLoader');

class PendingLeave extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchPendingLeave())
  }

  render() {
    const { isFetching, pending_items, isAuthenticated } = this.props
    return (
      <div className="PendingLeave">
        {isAuthenticated && (isFetching ?
          <div className="text-xs-center"><BeatLoader color="#0275d8" size="12px" /></div> :
          <PendingLeaveList pending_items={pending_items} />)
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { pendingLeave, adminAuth } = state

  const {
    isFetching,
    pending_items
  } = pendingLeave

  const { isAuthenticated } = adminAuth

  return {
    isFetching,
    pending_items,
    isAuthenticated
  }
}

export default connect(mapStateToProps)(PendingLeave)
