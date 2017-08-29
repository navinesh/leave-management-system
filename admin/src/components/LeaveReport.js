// @flow
import React from 'react';

type Props = {
  leave_record: Array<any>
};

const LeaveReportList = (props: Props) => {
  const itemNodes = props.leave_record.map(record =>
    <tr key={record.id}>
      <td>
        {record.user.othernames} {record.user.surname}
      </td>
      <td>
        {record.leave_name}
      </td>
      <td>
        {record.leave_type}
      </td>
      <td>
        {record.start_date}
      </td>
      <td>
        {record.end_date}
      </td>
      <td>
        {record.leave_status}
      </td>
      <td>
        {record.date_posted}
      </td>
      <td>
        {record.date_reviewed}
      </td>
      <td>
        {record.declined_reason}
      </td>
    </tr>
  );

  return itemNodes.length > 0
    ? <div className="container">
        <div className="table-responsive">
          <table
            className="table table-bordered table-hover"
            style={{ backgroundColor: '#FFFFFF' }}
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
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {itemNodes}
            </tbody>
          </table>
        </div>
      </div>
    : <div
        className="card card-body border-0"
        style={{ paddingTop: '100px', paddingBottom: '260px' }}
      >
        <h1 className="display-4 text-center">
          <em>There is no record to display.</em>
        </h1>
      </div>;
};

export default LeaveReportList;
