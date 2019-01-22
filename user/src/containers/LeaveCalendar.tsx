import React from 'react';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import ApprovedCalendar from '../components/LeaveCalendar';

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

const LeaveRecord = gql`
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
  return (
    <Query query={IS_AUTHENTICATED}>
      {({ data }) => {
        return data.isAuthenticated ? (
          <Query query={LeaveRecord} pollInterval={60000}>
            {({ loading, error, data }) => {
              if (loading) {
                return (
                  <div className="text-center" style={{ marginTop: '80px' }}>
                    <div className="loader" />
                  </div>
                );
              }

              if (error) {
                console.log(error.message);
                return (
                  <div className="col mx-auto">
                    <div className="text-center">
                      <p className="display-4">Something went wrong!</p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="container">
                  <ApprovedCalendar data={data} />
                </div>
              );
            }}
          </Query>
        ) : (
          <Redirect to="/" />
        );
      }}
    </Query>
  );
}
