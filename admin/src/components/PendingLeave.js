import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const RecordList = ({ pending_items }) => {
  var itemNodes = pending_items.map((record) => {
    return (
      <tr key={record.id}>
        <td>{record.user.othernames} {record.user.surname}</td>
        <td>{record.leave_name}</td>
        <td>{record.leave_type}</td>
        <td>{record.start_date}</td>
        <td>{record.end_date}</td>
        <td>{record.leave_days}</td>
        <td>{record.leave_reason}</td>
        <td>
          <Link to="/reset">Approve</Link>
        </td>
        <td>
          <Link to="/reset">Decline</Link>
        </td>
        <td>
          <Link to="/reset">Edit</Link>
        </td>
      </tr>
    )
  })
  return (
    <div className="table-responsive">
    <table className="table table-bordered table-hover">
      <thead className="thead-default">
        <tr>
          <th>Name</th>
          <th>Leave</th>
          <th>Type</th>
          <th>Start date</th>
          <th>End date</th>
          <th>Leave days</th>
          <th>Reason</th>
          <th>Approve</th>
          <th>Decline</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {itemNodes}
      </tbody>
    </table>
  </div>
  )
}

const PendingLeaveList = ({ pending_items }) => {
  return (
    <RecordList pending_items={pending_items} />
  )
}

PendingLeaveList.propTypes = {
  pending_items: PropTypes.array.isRequired
}

export default PendingLeaveList
