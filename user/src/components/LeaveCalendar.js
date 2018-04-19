// @flow
import React from 'react';

import '../spinners.css';

import done_all from '../img/done_all.png';

const moment = require('moment');

type Props = {
  data: Object
};

export default (props: Props) => {
  const { data: { findLeaveRecord } } = props;
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
    <div
      className="card card-body border-0"
      style={{
        paddingTop: '100px',
        paddingBottom: '260px',
        alignItems: 'center'
      }}
    >
      <img src={done_all} alt="All done" height="100" width="100" />
      <h1 className="display-4">You're all caught up.</h1>
    </div>
  );
};
