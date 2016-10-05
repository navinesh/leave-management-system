import React, { PropTypes } from 'react'
import { Link } from 'react-router'
const moment = require('moment')

const StaffList = ({ staff_record }) => {
  const itemNodes = staff_record.map((record) => {
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
              Bereavment
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
      </div>)
  })
  return (
    <div>
      {itemNodes}
  </div>
  )
}

const StaffRecordList = ({ staff_record }) =>
  <StaffList staff_record={staff_record} />


StaffRecordList.propTypes = {
  staff_record: PropTypes.array.isRequired
}

export default StaffRecordList
