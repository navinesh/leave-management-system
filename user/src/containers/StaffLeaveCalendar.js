// @flow
import React from 'react';

import { graphql, gql } from 'react-apollo';

import Leaves from '../components/LeaveCalendar';

const LeaveRecord = gql`
  {
    findLeaveRecord(leaveStatus: "approved") {
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
  data: Function
};

const LeaveCalendar = (props: Props) => (
  <div className="container" style={{ marginTop: '80px' }}>
    <Leaves data={props.data} />
  </div>
);

export default graphql(LeaveRecord)(LeaveCalendar);
