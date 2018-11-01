// @flow
import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

import UserLogin from './UserLogin';

import Error from '../img/error.gif';

const moment = require('moment');

const LEAVE_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "approved", isArchived: "false") {
      id
      leaveName
      startDate
      endDate
      leaveDays
      user {
        othernames
        surname
      }
    }
  }
`;

type Props = {
  dispatch: Function,
  isFetching: boolean,
  message: string
};

export default function(props: Props) {
  const { isFetching, message, dispatch } = props;

  return (
    <Query query={LEAVE_RECORD}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <div className="container">
              <div className="col-md-5 mx-auto pt-4">
                <UserLogin
                  isFetching={isFetching}
                  message={message}
                  dispatch={dispatch}
                />
              </div>
            </div>
          );
        }

        if (error) {
          console.log(error.message);
          return (
            <div className="col mx-auto" style={{ marginTop: '100px' }}>
              <div className="text-center">
                <p style={{ fontSize: '42px' }}>Oops!</p>
                <p style={{ fontSize: '24px' }}>Something went wrong!</p>
                <img src={Error} alt="Error" />
              </div>
            </div>
          );
        }

        const leaveRecords = data.findLeaveRecord
          .filter(record => {
            // get current date and format it
            let dateToday = moment();

            let todayDate = dateToday.format('DD/MM/YYYY');

            // get end date and format it
            let end_Date = moment(record.endDate, 'DD/MM/YYYY').format(
              'DD/MM/YYYY'
            );

            // check if current date and end date is same
            let isCurrentDate = todayDate === end_Date ? true : false;

            // get end date and format it
            let eDate = moment(record.endDate, 'DD/MM/YYYY').format(
              'MM/DD/YYYY'
            );

            let endDate = moment(new Date(eDate));

            // check if end date is same as or falls after current date
            let isEndDate = endDate.isSameOrAfter(dateToday);

            // return true for current and future dates
            return isCurrentDate || isEndDate ? true : false;
          })
          .sort((a, b) => {
            return a.user.othernames.localeCompare(b.user.othernames);
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
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
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
              </div>
              <div className="col-md-4">
                <UserLogin
                  isFetching={isFetching}
                  message={message}
                  dispatch={dispatch}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="col-md-5 mx-auto pt-4">
              <UserLogin
                isFetching={isFetching}
                message={message}
                dispatch={dispatch}
              />
            </div>
          </div>
        );
      }}
    </Query>
  );
}
