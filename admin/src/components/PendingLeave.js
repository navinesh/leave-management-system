import React, { PropTypes } from 'react'

const RecordList = ({ records, onApproveClick, onDeclineClick, onEditClick }) => {
  var itemNodes = records.map((record) => {
    return (
      <tr key={record.id}>
        <td>{record.user.othernames} {record.user.surname}</td>
        <td>{record.leave_name}</td>
        <td>{record.leave_type}</td>
        <td>{record.start_date}</td>
        <td>{record.end_date}</td>
        <td>{record.leave_days}</td>
        <td>{record.leave_reason}</td>
        <td><button onClick={() => onApproveClick()} className="btn btn-success">
          Approve
        </button></td>
        <td><button onClick={() => onDeclineClick()} className="btn btn-danger">
          Decline
        </button></td>
        <td><button onClick={() => onEditClick()} className="btn btn-warning">
          Edit
        </button></td>
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
          <th>Leave type</th>
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

const PendingLeaveList = ({ records }) => {
  return (
    <RecordList records={records} />
  )
}

PendingLeaveList.propTypes = {
  records: PropTypes.array.isRequired,
  onApproveClick: PropTypes.func.isRequired,
  onDeclineClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired
}

export default PendingLeaveList
