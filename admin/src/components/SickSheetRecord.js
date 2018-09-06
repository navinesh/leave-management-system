// @flow
import React from 'react';

type Props = {
  sickSheet_items: Object
};

export default (props: Props) => {
  const itemNodes = props.sickSheet_items.map(record => (
    <tr key={record.id}>
      <td>
        {record.user.othernames} {record.user.surname}
      </td>
      <td>{record.startDate}</td>
      <td>{record.endDate}</td>
      <td>{record.leaveDays}</td>
      <td>{record.datePosted}</td>
      <td>
        <a href={`http://api/sicksheetrecord/${record.fileName}`}>File</a>
      </td>
    </tr>
  ));

  return itemNodes.length > 0 ? (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Leave days</th>
            <th>Date applied</th>
            <th>Sick sheet</th>
          </tr>
        </thead>
        <tbody>{itemNodes}</tbody>
      </table>
    </div>
  ) : (
    <div
      className="card card-body border-0"
      style={{ paddingTop: '100px', paddingBottom: '260px' }}
    >
      <h1 className="display-4 text-center">
        <em>There is no record to display.</em>
      </h1>
    </div>
  );
};
