// @flow
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  sickSheet_items: Array<any>
};

export default (props: Props) => {
  const itemNodes = props.sickSheet_items.map(record =>
    <tr key={record.id}>
      <td>
        {record.user.othernames} {record.user.surname}
      </td>
      <td>
        {record.start_date}
      </td>
      <td>
        {record.end_date}
      </td>
      <td>
        {record.leave_days}
      </td>
      <td>
        {record.date_posted}
      </td>
      <td>
        <Link
          className="btn btn-primary btn-sm"
          to={`/sicksheetrecord/${record.file_name}`}
        >
          Download
        </Link>
      </td>
    </tr>
  );

  return itemNodes.length > 0
    ? <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Leave days</th>
              <th>Date applied</th>
              <th>Sick sheet</th>
            </tr>
          </thead>
          <tbody>
            {itemNodes}
          </tbody>
        </table>
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
