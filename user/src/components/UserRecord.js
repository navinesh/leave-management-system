// @flow
import React from 'react';
import { graphql, gql } from 'react-apollo';

import '../spinners.css';

const USER_RECORD = gql`
  query($id: Int) {
    findUser(id: $id) {
      leaverecord {
        edges {
          node {
            id
            leaveName
            leaveDays
            startDate
            endDate
            leaveReason
            leaveStatus
          }
        }
      }
    }
  }
`;

const PendingRecordList = props => {
  const pendingList = props.user_record.leaverecord.edges
    .filter(data => data.node.leaveStatus === 'pending')
    .map(record => (
      <tr key={record.node.id}>
        <td>{record.node.leaveName}</td>
        <td>{record.node.leaveDays}</td>
        <td>{record.node.startDate}</td>
        <td>{record.node.endDate}</td>
        <td>{record.node.leaveReason}</td>
      </tr>
    ));

  if (pendingList.length > 0) {
    return (
      <div className="col-md-12">
        <p className="text-uppercase">Pending Leave Schedule</p>
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Leave type</th>
              <th>Leave days</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>{pendingList}</tbody>
        </table>
      </div>
    );
  } else {
    return <div />;
  }
};

const ApprovedRecordList = props => {
  const approvedList = props.user_record.leaverecord.edges
    .filter(data => data.node.leaveStatus === 'approved')
    .map(record => (
      <tr key={record.node.id}>
        <td>{record.node.leaveName}</td>
        <td>{record.node.leaveDays}</td>
        <td>{record.node.startDate}</td>
        <td>{record.node.endDate}</td>
        <td>{record.node.leaveReason}</td>
      </tr>
    ));

  if (approvedList.length > 0) {
    return (
      <div className="col-md-12">
        <p className="text-uppercase">Approved Leave Schedule</p>
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Leave type</th>
              <th>Leave days</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>{approvedList}</tbody>
        </table>
      </div>
    );
  } else {
    return <div />;
  }
};

type Props = {
  userRecord: Object
};

export const UserRecord = (props: Props) => {
  const { userRecord: { loading, error, findUser: user } } = props;

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <div className="loader1" />
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error.message);
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <p>Something went wrong!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <PendingRecordList user_record={user} />
        <ApprovedRecordList user_record={user} />
      </div>
    </div>
  );
};

export default graphql(USER_RECORD, {
  options: ({ id }) => ({
    variables: { id }
  }),
  name: 'userRecord'
})(UserRecord);
