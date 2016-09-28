import React, { PropTypes } from 'react'

const RecordList = ({ records }) => {
  var itemNodes = records.map((record) => {
    return (
      <tr key={record.id}>
        <td>{record.user.othernames} {record.user.surname}</td>
        <td>{record.leave_name}</td>
        <td>{record.start_date}</td>
        <td>{record.end_date}</td>
        <td>{record.leave_days} day(s)</td>
      </tr>
    )
  })
  return (
    <div className="table-responsive">
    <table className="table table-bordered table-hover">
      <thead className="thead-default">
        <tr>
          <th>Name</th>
          <th>Leave type</th>
          <th>Start date</th>
          <th>End date</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {itemNodes}
      </tbody>
    </table>
  </div>
  )
}

const Leaves = ({ records }) => {
  return (
    <RecordList records={records} />
  )
}

Leaves.propTypes = {
  records: PropTypes.array.isRequired
}

export default Leaves
