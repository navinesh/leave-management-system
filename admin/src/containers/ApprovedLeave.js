import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchApprovedLeave } from '../actions/ApprovedLeave'
import ApprovedLeaveList from '../components/ApprovedLeave'

const BeatLoader = require('halogen/BeatLoader');

class ApprovedLeave extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchApprovedLeave())
  }

  render() {
    const { approved_items, isFetching } = this.props
    return (
      <div className="container">
        {isFetching ?
          <div className="text-xs-center"><BeatLoader color="#0275d8" size="12px" /></div> :
          <ApprovedLeaveList approved_items={approved_items} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { approvedLeave } = state
  const {
    isFetching,
    approved_items
  } = approvedLeave

  return {
    approved_items,
    isFetching
  }
}

export default connect(mapStateToProps)(ApprovedLeave)
