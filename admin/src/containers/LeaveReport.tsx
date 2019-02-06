import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';

import {
  ApprovedLeaveReportList,
  PendingLeaveReportList,
  CancelledLeaveReportList,
  DeclinedLeaveReportList,
  ArchivedLeaveReportList,
  LeaveUpdatesReportList,
  StaffRecordList,
  UserUpdatesReportList
} from '../components/LeaveReport';

const IS_AUTHENTICATED = gql`
  query isAdminAuthenticated {
    isAuthenticated @client
    admin_token @client
  }
`;

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      Admin {
        othernames
      }
      token
      ok
    }
  }
`;

const PENDING_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "pending", isArchived: "false") {
      id
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveStatus
      leaveReason
      datePosted
      user {
        othernames
        surname
      }
    }
  }
`;

const APPROVED_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "approved", isArchived: "false") {
      id
      userId
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveStatus
      leaveReason
      datePosted
      dateReviewed
      user {
        othernames
        surname
        employeeNumber
      }
    }
  }
`;

const CANCELLED_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "cancelled", isArchived: "false") {
      id
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveStatus
      cancelledReason
      datePosted
      dateReviewed
      user {
        othernames
        surname
      }
    }
  }
`;

const DECLINED_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "declined", isArchived: "false") {
      id
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveStatus
      declinedReason
      datePosted
      dateReviewed
      user {
        othernames
        surname
      }
    }
  }
`;

const ARCHIVED_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "archived", isArchived: "false") {
      id
      userId
      leaveName
      leaveType
      startDate
      endDate
      leaveDays
      leaveStatus
      leaveReason
      datePosted
      dateReviewed
      user {
        othernames
        surname
        employeeNumber
      }
    }
  }
`;

const LEAVE_UPDATES_RECORD = gql`
  {
    findLeaveUpdates(isArchived: "false") {
      id
      leaveId
      previousStartDate
      previousEndDate
      previousLeaveName
      previousLeaveDays
      updatedStartDate
      updatedEndDate
      updatedLeaveName
      updatedLeaveDays
      editReason
      datePosted
      leaverecord {
        user {
          othernames
          surname
        }
      }
    }
  }
`;

const ACTIVE_USERS = gql`
  {
    findUsers(isArchived: "false") {
      id
      othernames
      surname
      annual
      sick
      bereavement
      familyCare
      christmas
      maternity
      paternity
      employeeNumber
      employeeStartDate
    }
  }
`;

const USER_UPDATES_RECORD = gql`
  {
    findUserUpdates(isArchived: "false") {
      id
      userId
      annual
      sick
      bereavement
      familyCare
      christmas
      maternity
      paternity
      designation
      dateOfBirth
      gender
      editReason
      datePosted
      user {
        othernames
        surname
      }
    }
  }
`;

interface TabsProps {
  data: Array<TabData>;
}

interface TabData {
  label: string;
  content: any;
}

export function Tabs(props: TabsProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  function selectTabIndex(index: number): void {
    setActiveIndex(index);
  }

  function renderTabs(): JSX.Element[] {
    return props.data.map((tab, index) => {
      const isActive = activeIndex === index;
      return (
        <div className="nav-link btn" key={index}>
          <div
            className={
              isActive
                ? 'border border-right-0 border-left-0 border-top-0 border-secondary'
                : 'text-secondary btn-link'
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
    return <div>{props.data[activeIndex].content}</div>;
  }

  return (
    <div className="container">
      <nav className="nav justify-content-center">{renderTabs()}</nav>
      <div className="mt-1">{renderPanel()}</div>
    </div>
  );
}

type Props = {
  verifyAdminToken: Function;
};

function LeaveReportList(props: Props): JSX.Element {
  useEffect(function(): void {
    props.verifyAdminToken();
  }, []);

  const tabData = [
    {
      label: 'Pending',
      content: (
        <Query query={PENDING_RECORD} pollInterval={60000}>
          {({
            loading: pendingLoading,
            error: pendingError,
            data: { findLeaveRecord: pending_record }
          }) => {
            if (pendingLoading) {
              return (
                <div className="text-center" style={{ marginTop: '80px' }}>
                  <div className="loader" />
                </div>
              );
            }

            if (pendingError) {
              console.log(pendingError);
              return (
                <div className="text-center">
                  <p>Something went wrong!</p>
                </div>
              );
            }

            return <PendingLeaveReportList pending_record={pending_record} />;
          }}
        </Query>
      )
    },
    {
      label: 'Approved',
      content: (
        <Query query={APPROVED_RECORD} pollInterval={60000}>
          {({
            loading: approvedLoading,
            error: approvedError,
            data: { findLeaveRecord: approved_record }
          }) => {
            if (approvedLoading) {
              return (
                <div className="text-center" style={{ marginTop: '80px' }}>
                  <div className="loader" />
                </div>
              );
            }

            if (approvedError) {
              console.log(approvedError);
              return (
                <div className="text-center">
                  <p>Something went wrong!</p>
                </div>
              );
            }

            return (
              <ApprovedLeaveReportList approved_record={approved_record} />
            );
          }}
        </Query>
      )
    },
    {
      label: 'Cancelled',
      content: (
        <Query query={CANCELLED_RECORD} pollInterval={60000}>
          {({
            loading: cancelledLoading,
            error: cancelledError,
            data: { findLeaveRecord: cancelled_record }
          }) => {
            if (cancelledLoading) {
              return (
                <div className="text-center" style={{ marginTop: '80px' }}>
                  <div className="loader" />
                </div>
              );
            }

            if (cancelledError) {
              console.log(cancelledError);
              return (
                <div className="text-center">
                  <p>Something went wrong!</p>
                </div>
              );
            }

            return (
              <CancelledLeaveReportList cancelled_record={cancelled_record} />
            );
          }}
        </Query>
      )
    },
    {
      label: 'Declined',
      content: (
        <Query query={DECLINED_RECORD} pollInterval={60000}>
          {({
            loading: declinedLoading,
            error: declinedError,
            data: { findLeaveRecord: declined_record }
          }) => {
            if (declinedLoading) {
              return (
                <div className="text-center" style={{ marginTop: '80px' }}>
                  <div className="loader" />
                </div>
              );
            }

            if (declinedError) {
              console.log(declinedError);
              return (
                <div className="text-center">
                  <p>Something went wrong!</p>
                </div>
              );
            }

            return (
              <DeclinedLeaveReportList declined_record={declined_record} />
            );
          }}
        </Query>
      )
    },
    {
      label: 'Archived',
      content: (
        <Query query={ARCHIVED_RECORD} pollInterval={60000}>
          {({
            loading: archivedLoading,
            error: archivedError,
            data: { findLeaveRecord: archived_record }
          }) => {
            if (archivedLoading) {
              return (
                <div className="text-center" style={{ marginTop: '80px' }}>
                  <div className="loader" />
                </div>
              );
            }

            if (archivedError) {
              console.log(archivedError);
              return (
                <div className="text-center">
                  <p>Something went wrong!</p>
                </div>
              );
            }

            return (
              <ArchivedLeaveReportList
                archived_record={archived_record}
                ARCHIVED_RECORDS={ARCHIVED_RECORD}
              />
            );
          }}
        </Query>
      )
    },
    {
      label: 'User updates',
      content: (
        <Query query={USER_UPDATES_RECORD} pollInterval={60000}>
          {({
            loading: userLoading,
            error: userError,
            data: { findUserUpdates: user_updates }
          }) => {
            if (userLoading) {
              return (
                <div className="text-center" style={{ marginTop: '80px' }}>
                  <div className="loader" />
                </div>
              );
            }

            if (userError) {
              console.log(userError);
              return (
                <div className="text-center">
                  <p>Something went wrong!</p>
                </div>
              );
            }

            return <UserUpdatesReportList user_updates={user_updates} />;
          }}
        </Query>
      )
    },
    {
      label: 'Leave updates',
      content: (
        <Query query={LEAVE_UPDATES_RECORD} pollInterval={60000}>
          {({
            loading: leaveLoading,
            error: leaveError,
            data: { findLeaveUpdates: leave_updates }
          }) => {
            if (leaveLoading) {
              return (
                <div className="text-center" style={{ marginTop: '80px' }}>
                  <div className="loader" />
                </div>
              );
            }

            if (leaveError) {
              console.log(leaveError);
              return (
                <div className="text-center">
                  <p>Something went wrong!</p>
                </div>
              );
            }

            return <LeaveUpdatesReportList leave_updates={leave_updates} />;
          }}
        </Query>
      )
    },
    {
      label: 'User record',
      content: (
        <Query query={ACTIVE_USERS} pollInterval={60000}>
          {({
            loading: activeUsersLoading,
            error: activeUsersError,
            data: { findUsers: staff_record }
          }) => {
            if (activeUsersLoading) {
              return (
                <div className="text-center" style={{ marginTop: '80px' }}>
                  <div className="loader" />
                </div>
              );
            }

            if (activeUsersError) {
              console.log(activeUsersError);
              return (
                <div className="text-center">
                  <p>Something went wrong!</p>
                </div>
              );
            }

            return <StaffRecordList staff_record={staff_record} />;
          }}
        </Query>
      )
    }
  ];

  return <Tabs data={tabData} />;
}

export default function LeaveReport(): JSX.Element {
  return (
    <Query query={IS_AUTHENTICATED}>
      {({ data }) => {
        let adminToken = data.admin_token
          ? data.admin_token
          : localStorage.getItem('admin_token');

        return data.isAuthenticated ? (
          <ApolloConsumer>
            {client => (
              <Mutation
                mutation={VERIFY_ADMIN_TOKEN}
                variables={{ adminToken: adminToken }}
                onCompleted={data => {
                  if (data.verifyAdminToken) {
                    TokenSuccess(data, client);
                  } else {
                    TokenFailure(client);
                  }
                }}
              >
                {verifyAdminToken => {
                  return (
                    <LeaveReportList verifyAdminToken={verifyAdminToken} />
                  );
                }}
              </Mutation>
            )}
          </ApolloConsumer>
        ) : (
          <Redirect to="/login" />
        );
      }}
    </Query>
  );
}
