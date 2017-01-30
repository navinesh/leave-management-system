import React, { PropTypes } from "react";

const LeaveReportList = ({ leave_record }) => {
  const itemNodes = leave_record.map(record => {
    return (
      <tr key={record.id}>
        <td>{record.user.othernames}{" "}{record.user.surname}</td>
        <td>{record.leave_name}</td>
        <td>{record.leave_type}</td>
        <td>{record.start_date}</td>
        <td>{record.end_date}</td>
        <td>{record.leave_status}</td>
        <td>{record.date_posted}</td>
        <td>{record.date_reviewed}</td>
        <td>{record.declined_reason}</td>
      </tr>
    );
  });

  return (
    <div className="table-responsive">
      <table
        className="table table-bordered table-hover"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <thead className="thead-default">
          <tr>
            <th>Name</th>
            <th>Leave</th>
            <th>Type</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Status</th>
            <th>Date posted</th>
            <th>Date reviewed</th>
            <th>Reason for decline</th>
          </tr>
        </thead>
        <tbody>
          {itemNodes}
        </tbody>
      </table>
    </div>
  );
};

LeaveReportList.propTypes = { leave_record: PropTypes.array.isRequired };

export default LeaveReportList;
