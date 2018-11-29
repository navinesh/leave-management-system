// @flow
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import '../spinners.css';
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

function ApprovedRecordList(props) {
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
      <div align="center">
        <img src={NoData} alt="No data" />
      </div>
    );
  }
}

function PendingRecordList(props) {
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
      <div align="center">
        <img src={NoData} alt="No data" />
      </div>
    );
  }
}

type tabsProps = {
  data: Array<any>
};

// type tabsState = {
//   activeIndex: number
// };

function Tabs(props: tabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function selectTabIndex(e: SyntheticEvent<HTMLElement>) {
    setActiveIndex(parseInt(e.currentTarget.id, 10));
  }

  function renderTabs() {
    return props.data.map((tab, index) => {
      const isActive = activeIndex === index;
      return (
        <div className="nav-link btn" key={index}>
          <div
            className={
              isActive
                ? 'border border-right-0 border-left-0 border-top-0 border-secondary'
                : 'text-secondary'
            }
            onClick={selectTabIndex}
            id={index}
          >
            {tab.label}
          </div>
        </div>
      );
    });
  }

  function renderPanel() {
    return <>{props.data[activeIndex].content}</>;
  }

  return (
    <>
      <nav className="nav">{renderTabs()}</nav>
      <div className="mt-2">{renderPanel()}</div>
    </>
  );
}

type Props = {
  id: any
};

export default function UserRecord(props: Props) {
  return (
    <Query
      query={USER_RECORD}
      variables={{ id: props.id }}
      pollInterval={60000}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <div
              className="container text-center"
              style={{ paddingTop: '80px' }}
            >
              <div className="col-md-8 ml-auto mr-auto">
                <div className="loader" />
              </div>
            </div>
          );
        }

        if (error) {
          console.log(error.message);
          return (
            <div
              className="container text-center"
              style={{ paddingTop: '100px' }}
            >
              <div className="col-md-8 ml-auto mr-auto">
                <p>Something went wrong!</p>
              </div>
            </div>
          );
        }

        const tabData = [
          {
            label: 'Approved leave schedule',
            content: <ApprovedRecordList user_record={data.user} />
          },
          {
            label: 'Pending leave schedule',
            content: <PendingRecordList user_record={data.user} />
          }
        ];

        return (
          <div className="container">
            <Tabs data={tabData} />
          </div>
        );
      }}
    </Query>
  );
}
