import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
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
  UserUpdatesReportList,
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
      <nav className="nav">{renderTabs()}</nav>
      <div className="mt-1">{renderPanel()}</div>
    </div>
  );
}

function Pending(): JSX.Element {
  const { loading: pendingLoading, error: pendingError, data }: any = useQuery(
    PENDING_RECORD,
    {
      pollInterval: 60000,
    }
  );

  if (pendingLoading) {
    return (
      <div className="text-center" style={{ marginTop: '80px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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

  return <PendingLeaveReportList pending_record={data.findLeaveRecord} />;
}

function Approved(): JSX.Element {
  const {
    loading: approvedLoading,
    error: approvedError,
    data,
  }: any = useQuery(APPROVED_RECORD, {
    pollInterval: 60000,
  });

  if (approvedLoading) {
    return (
      <div className="text-center" style={{ marginTop: '80px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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
  return <ApprovedLeaveReportList approved_record={data.findLeaveRecord} />;
}

function Cancelled(): JSX.Element {
  const {
    loading: cancelledLoading,
    error: cancelledError,
    data,
  }: any = useQuery(CANCELLED_RECORD, {
    pollInterval: 60000,
  });

  if (cancelledLoading) {
    return (
      <div className="text-center" style={{ marginTop: '80px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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
  return <CancelledLeaveReportList cancelled_record={data.findLeaveRecord} />;
}

function Declined(): JSX.Element {
  const {
    loading: declinedLoading,
    error: declinedError,
    data,
  }: any = useQuery(DECLINED_RECORD, {
    pollInterval: 60000,
  });

  if (declinedLoading) {
    return (
      <div className="text-center" style={{ marginTop: '80px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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
  return <DeclinedLeaveReportList declined_record={data.findLeaveRecord} />;
}

function Archived(): JSX.Element {
  const {
    loading: archivedLoading,
    error: archivedError,
    data,
  }: any = useQuery(ARCHIVED_RECORD, {
    pollInterval: 60000,
  });

  if (archivedLoading) {
    return (
      <div className="text-center" style={{ marginTop: '80px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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
      archived_record={data.findLeaveRecord}
      ARCHIVED_RECORDS={ARCHIVED_RECORD}
    />
  );
}

function Userupdates(): JSX.Element {
  const { loading: userLoading, error: userError, data }: any = useQuery(
    USER_UPDATES_RECORD,
    {
      pollInterval: 60000,
    }
  );

  if (userLoading) {
    return (
      <div className="text-center" style={{ marginTop: '80px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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
  return <UserUpdatesReportList user_updates={data.findUserUpdates} />;
}

function Leaveupdates(): JSX.Element {
  const { loading: leaveLoading, error: leaveError, data }: any = useQuery(
    LEAVE_UPDATES_RECORD,
    {
      pollInterval: 60000,
    }
  );

  if (leaveLoading) {
    return (
      <div className="text-center" style={{ marginTop: '80px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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
  return <LeaveUpdatesReportList leave_updates={data.findLeaveUpdates} />;
}

function Userrecord(): JSX.Element {
  const {
    loading: activeUsersLoading,
    error: activeUsersError,
    data,
  }: any = useQuery(ACTIVE_USERS, {
    pollInterval: 60000,
  });

  if (activeUsersLoading) {
    return (
      <div className="text-center" style={{ marginTop: '80px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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
  return <StaffRecordList staff_record={data.findUsers} />;
}

export default function LeaveReport(): JSX.Element {
  const client = useApolloClient();

  const { data } = useQuery(IS_AUTHENTICATED);
  let adminToken = data.admin_token
    ? data.admin_token
    : localStorage.getItem('admin_token');

  const [verifyAdminToken] = useMutation(VERIFY_ADMIN_TOKEN, {
    variables: { adminToken: adminToken },
    onCompleted(data) {
      if (data.verifyAdminToken) {
        TokenSuccess(data, client);
      } else {
        TokenFailure(client);
      }
    },
  });

  useEffect((): void => {
    verifyAdminToken();
  }, [verifyAdminToken]);

  const tabData = [
    {
      label: 'Pending',
      content: <Pending />,
    },
    {
      label: 'Approved',
      content: <Approved />,
    },
    {
      label: 'Cancelled',
      content: <Cancelled />,
    },
    {
      label: 'Declined',
      content: <Declined />,
    },
    {
      label: 'Archived',
      content: <Archived />,
    },
    {
      label: 'User updates',
      content: <Userupdates />,
    },
    {
      label: 'Leave updates',
      content: <Leaveupdates />,
    },
    {
      label: 'User record',
      content: <Userrecord />,
    },
  ];

  return data.isAuthenticated ? (
    <Tabs data={tabData} />
  ) : (
    <Redirect to="/login" />
  );
}
