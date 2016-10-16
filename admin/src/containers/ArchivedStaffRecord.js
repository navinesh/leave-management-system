import React, {Component} from 'react'
import { connect } from 'react-redux'
import { fetchArchivedStaffRecord } from '../actions/ArchivedStaffRecord'
import { clearSearchStaffRecord } from '../actions/StaffRecord'
import ArchivedStaffRecordList from '../components/ArchivedStaffRecord'

class ArchivedStaffRecord extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchArchivedStaffRecord())
    dispatch(clearSearchStaffRecord())
  }

  render () {
    const { archived_staff_record, searchTerm, dispatch } = this.props
    return (
      <ArchivedStaffRecordList  archived_staff_record={archived_staff_record} searchTerm={searchTerm} dispatch={dispatch} />
    )
  }
}

const mapStateToProps = (state) => {
  const { archivedStaffRecord, searchStaffRecord } = state
  const { archived_staff_record } = archivedStaffRecord
  const { searchTerm } = searchStaffRecord
  return {
    archived_staff_record,
    searchTerm
  }
}

export default connect(mapStateToProps)(ArchivedStaffRecord)
