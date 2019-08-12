import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import NoData from '../img/undraw_no_data_qbuo.svg';

const USER_RECORD = gql`
  query($id: ID!) {
    user(id: $id) {
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

interface UserLeaveDataProps {
  user_record: UserRecord;
}

interface UserRecord {
  leaverecord: LeaveRecord;
}

interface LeaveRecord {
  edges: Array<Edge>;
}

interface Edge {
  node: UserLeaveData;
}

interface UserLeaveData {
  leaveStatus: string;
  id: string;
  leaveName: string;
  leaveDays: number;
  startDate: Date;
  endDate: Date;
  leaveReason: string;
}

function ApprovedRecordList(props: UserLeaveDataProps): JSX.Element {
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
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
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
    );
  } else {
    return (
      <div data-align="center">
        <img src={NoData} alt="No data" width="40%" height="40%" />
      </div>
    );
  }
}

function PendingRecordList(props: UserLeaveDataProps): JSX.Element {
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
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
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
    );
  } else {
    return (
      <div data-align="center">
        <img src={NoData} alt="No data" width="40%" height="40%" />
      </div>
    );
  }
}

function ArchivedRecordList(props: UserLeaveDataProps): JSX.Element {
  const pendingList = props.user_record.leaverecord.edges
    .filter(data => data.node.leaveStatus === 'archived')
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
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
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
    );
  } else {
    return (
      <div data-align="center">
        <img src={NoData} alt="No data" width="40%" height="40%" />
      </div>
    );
  }
}

interface TabsProps {
  data: Array<TabData>;
}

interface TabData {
  label: string;
  content: any;
}

function Tabs(props: TabsProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  function selectTabIndex(index: number): void {
    setActiveIndex(index);
  }

  function renderHeading(): JSX.Element {
    return <h5>Leave status</h5>;
  }

  function renderTabs(): JSX.Element[] {
    return props.data.map((tab, index) => {
      const isActive = activeIndex === index;
      return (
        <div className="btn pl-0" key={index}>
          <div
            className={
              isActive ? 'border-secondary border-bottom' : 'text-secondary'
            }
            onClick={() => selectTabIndex(index)}
          >
            {tab.label}
          </div>
        </div>
      );
    });
  }

  function renderPanel(): JSX.Element {
    return <div className="pt-2">{props.data[activeIndex].content}</div>;
  }

  return (
    <div className="container">
      {renderHeading()}
      {renderTabs()}
      {renderPanel()}
    </div>
  );
}

interface Props {
  id: string;
}

export default function UserRecord(props: Props): JSX.Element {
  const { loading, error, data } = useQuery(USER_RECORD, {
    variables: { id: props.id },
    pollInterval: 60000
  });

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '80px' }}>
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
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <p>Something went wrong!</p>
        </div>
      </div>
    );
  }

  const tabData = [
    {
      label: 'Approved',
      content: <ApprovedRecordList user_record={data.user} />
    },
    {
      label: 'Pending',
      content: <PendingRecordList user_record={data.user} />
    },
    {
      label: 'Archived',
      content: <ArchivedRecordList user_record={data.user} />
    }
  ];

  return <Tabs data={tabData} />;
}
