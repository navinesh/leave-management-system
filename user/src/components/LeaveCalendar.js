// @flow
import React from 'react';

import '../spinners.css';

const moment = require('moment');

type Props = {
  data: Object
};

export default (props: Props) => {
  const { data: { loading, error, findLeaveRecord } } = props;

  if (loading) {
    return (
      <div className="text-center">
        <div className="loader1" />
      </div>
    );
  }

  if (error) {
    console.log(error.message);
    return (
      <div className="col mx-auto" style={{ marginTop: '100px' }}>
        <div className="text-center">
          <p className="display-4">Something went wrong!</p>
        </div>
      </div>
    );
  }

  const leaveRecords = findLeaveRecord
    .filter(record => {
      // get current date and format it
      let dateToday = moment();

      let todayDate = dateToday.format('DD/MM/YYYY');

      // get end date and format it
      let end_Date = moment(record.endDate, 'DD/MM/YYYY').format('DD/MM/YYYY');

      // check if current date and end date is same
      let isCurrentDate = todayDate === end_Date ? true : false;

      // get end date and format it
      let eDate = moment(record.endDate, 'DD/MM/YYYY').format('MM/DD/YYYY');

      let endDate = moment(new Date(eDate));

      // check if end date is same as or falls after current date
      let isEndDate = endDate.isSameOrAfter(dateToday);

      // return true for current and future dates
      return isCurrentDate || isEndDate ? true : false;
    })
    .map(data => (
      <tr key={data.id}>
        <td>
          {data.user.othernames} {data.user.surname}
        </td>
        <td>{data.leaveName}</td>
        <td>{data.startDate}</td>
        <td>{data.endDate}</td>
        <td>{data.leaveDays}</td>
      </tr>
    ));

  return leaveRecords.length > 0 ? (
    <div className="table-responsive">
      <table
        className="table table-bordered table-hover"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Leave type</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Leave days</th>
          </tr>
        </thead>
        <tbody>{leaveRecords}</tbody>
      </table>
    </div>
  ) : (
    <div style={{ paddingTop: '100px', paddingBottom: '220px' }}>
      <h1 className="display-4 text-center">
        <em>There is no data to display.</em>
      </h1>
    </div>
  );
};
