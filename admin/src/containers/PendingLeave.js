import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPendingLeave } from '../actions/PendingLeave'
import PendingLeaveList from '../components/PendingLeave'

class PendingLeave extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchPendingLeave())
  }

  render() {
    const { records, isFetching } = this.props
    return (
      <div className="container">
        {isFetching ?
          <div className="text-xs-center">Loading...</div> :
          <PendingLeaveList records={records} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { pendingLeave } = state
  const {
    isFetching,
    items: records
  } = pendingLeave

  return {
    records,
    isFetching
  }
}

export default connect(mapStateToProps)(PendingLeave)
