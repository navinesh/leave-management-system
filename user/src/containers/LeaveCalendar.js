//@ flow
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

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
  data: Object
};

const LeaveCalendar = (props: Props) => (
  <div className="container" style={{ marginTop: '80px' }}>
    <Leaves data={props.data} />
  </div>
);

export default graphql(LeaveRecord)(LeaveCalendar);
