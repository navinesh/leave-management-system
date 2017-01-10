import React, { PropTypes, Component } from 'react'
const moment = require('moment')
import { searchStaffRecord } from '../actions/StaffRecord'

class StaffRecordList extends Component {
  handleSearchChange (e) {
    this.props.dispatch(searchStaffRecord((e.target.value).toLowerCase()))
  }

  editRecord (e) {
    console.log('edit')
  }

  archiveRecord (e) {
    console.log('archive')
  }

  render () {
    const { staff_record, searchTerm } = this.props
    const filteredElements = staff_record
      .filter(e => e.othernames.toLowerCase().includes(searchTerm) || e.surname.toLowerCase().includes(searchTerm))
      .map(record => {
        let dob = new Date(record.date_of_birth)
        let dateOfBirth = moment(dob).format('DD/MM/YYYY')
        return (
          <div className="col-md-3" key={record.id}>
            <div className="card card-block">
              <ul className="list-unstyled">
                <li className="h5">{record.othernames} {record.surname}</li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">{record.annual}</span>
                  Annual
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">{record.sick}</span>
                  Sick
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">{record.bereavement}</span>
                  Bereavement
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">{record.christmas}</span>
                  Christmas
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">{dateOfBirth}</span>
                  DOB
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">{record.maternity}</span>
                  Maternity
                </li>
                <li>
                  <button onClick={this.editRecord.bind(this)} className="btn btn-link p-0">Edit</button>
                  <button onClick={this.archiveRecord.bind(this)} className="btn btn-link">Archive</button>
                </li>
              </ul>
            </div>
          </div>)
        })

    return (
      <div className="StaffRecordList">
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                onChange={this.handleSearchChange.bind(this)} />
            </div>
          </div>
        </div>
        <div className="row">
        {filteredElements}
        </div>
      </div>
    )
  }
}

StaffRecordList.propTypes = {
  staff_record: PropTypes.array.isRequired,
  searchTerm: React.PropTypes.string,
  dispatch: PropTypes.func.isRequired
}

export default StaffRecordList
