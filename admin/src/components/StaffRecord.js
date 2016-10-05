import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
const moment = require('moment')
import { searchStaffRecord } from '../actions/StaffRecord'

class StaffRecordList extends Component {
  handleSearchChange (e) {
    this.props.dispatch(searchStaffRecord((e.target.value).toLowerCase()))
  }

  render () {
    const { staff_record, searchTerm } = this.props
    const filteredElements = staff_record
      .filter(e => e.othernames.toLowerCase().includes(searchTerm) || e.surname.toLowerCase().includes(searchTerm))
      .map(record => {
        let dob = new Date(record.date_of_birth)
        let dateOfBirth = moment(dob).format('DD/MM/YYYY')
        return (
        <div className="col-sm-3" key={record.id}>
          <div className="card">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">{record.othernames} {record.surname}</li>
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{record.annual}</span>
                Annual
              </li>
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{record.sick}</span>
                Sick
              </li>
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{record.bereavement}</span>
                Bereavement
              </li>
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{record.christmas}</span>
                Christmas
              </li>
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{dateOfBirth}</span>
                DOB
              </li>
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{record.maternity}</span>
                Maternity
              </li>
              <li className="list-group-item">
                <Link to="#" className="card-link">Edit</Link>
                <Link to="#" className="card-link">Archive</Link>
              </li>
            </ul>
          </div>
        </div>)})

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
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
