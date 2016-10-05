import React, {Component} from 'react'
import { connect } from 'react-redux'
import { fetchStaffRecord, clearSearchStaffRecord } from '../actions/StaffRecord'
import StaffRecordList from '../components/StaffRecord'

class StaffRecord extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchStaffRecord())
    dispatch(clearSearchStaffRecord())
  }

  render () {
    const { staff_record, searchTerm, dispatch } = this.props
    return (
      <StaffRecordList  staff_record={staff_record} searchTerm={searchTerm} dispatch={dispatch} />
    )
  }
}

const mapStateToProps = (state) => {
  const { staffRecord, searchStaffRecord } = state
  const { staff_record } = staffRecord
  const { searchTerm } = searchStaffRecord
  return {
    staff_record,
    searchTerm
  }
}

export default connect(mapStateToProps)(StaffRecord)
