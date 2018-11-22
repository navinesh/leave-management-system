//@ flow
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

import Leaves from '../components/LeaveCalendar';

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

type Props = {
  isAuthenticated: boolean
};

function LeaveCalendar(props: Props) {
  return (
    <>
      {props.isAuthenticated ? (
        <Query query={LeaveRecord} pollInterval={60000}>
          {({ loading, error, data }) => {
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
                <div className="col mx-auto">
                  <div className="text-center">
                    <p className="display-4">Something went wrong!</p>
                  </div>
                </div>
              );
            }

            return (
              <div className="container">
                <Leaves data={data} />
              </div>
            );
          }}
        </Query>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { userAuth } = state;
  const { isAuthenticated } = userAuth;

  return { isAuthenticated };
}

export default connect(mapStateToProps)(LeaveCalendar);
