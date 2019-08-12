import React from 'react';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import ApprovedCalendar from '../components/LeaveCalendar';

import Error from '../img/error.gif';

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

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

export default function LeaveCalendar(): JSX.Element {
  const {
    data: { isAuthenticated }
  }: any = useQuery(IS_AUTHENTICATED);

  const { loading, error, data } = useQuery(LEAVE_RECORD, {
    pollInterval: 60000
  });

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error.message);
    return (
      <div className="col mx-auto">
        <div className="text-center">
          <p style={{ fontSize: '42px' }}>Oops!</p>
          <p style={{ fontSize: '24px' }}>Something went wrong!</p>
          <img src={Error} alt="Error" />
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <div className="container">
      <ApprovedCalendar data={data} />
    </div>
  ) : (
    <Redirect to="/" />
  );
}
