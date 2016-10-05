import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchStaffRecord } from '../actions/StaffRecord'
import StaffRecordList from '../components/StaffRecord'

const BeatLoader = require('halogen/BeatLoader');

class StaffRecord extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchStaffRecord())
  }

  render() {
    const { isFetching, staff_record, isAuthenticated } = this.props
    return (
      <div className="container">
        {isAuthenticated && (isFetching ?
          <div className="text-xs-center"><BeatLoader color="#0275d8" size="12px" /></div> :
          <StaffRecordList staff_record={staff_record} />)
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { staffRecord, adminAuth } = state
  const {
    isFetching,
    staff_record
  } = staffRecord

  const { isAuthenticated } = adminAuth

  return {
    isFetching,
    staff_record,
    isAuthenticated
  }
}

export default connect(mapStateToProps)(StaffRecord)
