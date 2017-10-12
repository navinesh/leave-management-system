// @flow
import React, { Component } from 'react';

import { CSVLink } from 'react-csv';

const moment = require('moment');

const ApprovedLeaveReportList = props => {
  const approvedRecord = props.approved_record.map(a => a).sort((b, c) => {
    return b.userId - c.userId;
  });

  const approvedRecordItems = approvedRecord.map(record => (
    <tr key={record.id}>
      <td>
        {record.user.othernames} {record.user.surname}
      </td>
      <td>{record.leaveName}</td>
      <td>{record.leaveType}</td>
      <td>{record.startDate}</td>
      <td>{record.endDate}</td>
      <td>{record.leaveStatus}</td>
      <td>{record.leaveReason}</td>
      <td>{record.datePosted}</td>
      <td>{record.dateReviewed}</td>
    </tr>
  ));

  return approvedRecordItems.length > 0 ? (
    <div>
      <CSVLink
        data={approvedRecord}
        filename={'Approved-leave.csv'}
        className="btn btn-outline-primary mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Leave</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Date posted</th>
              <th>Date reviewed</th>
            </tr>
          </thead>
          <tbody>{approvedRecordItems}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <div
      className="card card-body border-0"
      style={{ paddingTop: '100px', paddingBottom: '260px' }}
    >
      <h1 className="display-4 text-center">
        <em>There is no record to display.</em>
      </h1>
    </div>
  );
};

const PendingLeaveReportList = props => {
  const pendingRecord = props.pending_record.map(a => a).sort((b, c) => {
    return b.userId - c.userId;
  });

  const pendingRecordItems = pendingRecord.map(record => (
    <tr key={record.id}>
      <td>
        {record.user.othernames} {record.user.surname}
      </td>
      <td>{record.leaveName}</td>
      <td>{record.leaveType}</td>
      <td>{record.startDate}</td>
      <td>{record.endDate}</td>
      <td>{record.leaveStatus}</td>
      <td>{record.leaveReason}</td>
      <td>{record.datePosted}</td>
      <td>{record.dateReviewed}</td>
    </tr>
  ));

  return pendingRecordItems.length > 0 ? (
    <div>
      <CSVLink
        data={pendingRecord}
        filename={'Pending-leave.csv'}
        className="btn btn-outline-primary mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Leave</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Date posted</th>
              <th>Date reviewed</th>
            </tr>
          </thead>
          <tbody>{pendingRecordItems}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <div
      className="card card-body border-0"
      style={{ paddingTop: '100px', paddingBottom: '260px' }}
    >
      <h1 className="display-4 text-center">
        <em>There is no record to display.</em>
      </h1>
    </div>
  );
};

const CancelledLeaveReportList = props => {
  const cancelledRecord = props.cancelled_record.map(a => a).sort((b, c) => {
    return b.userId - c.userId;
  });

  const cancelledRecordItems = cancelledRecord.map(record => (
    <tr key={record.id}>
      <td>
        {record.user.othernames} {record.user.surname}
      </td>
      <td>{record.leaveName}</td>
      <td>{record.leaveType}</td>
      <td>{record.startDate}</td>
      <td>{record.endDate}</td>
      <td>{record.leaveStatus}</td>
      <td>{record.cancelledReason}</td>
      <td>{record.datePosted}</td>
      <td>{record.dateReviewed}</td>
    </tr>
  ));

  return cancelledRecordItems.length > 0 ? (
    <div>
      <CSVLink
        data={cancelledRecord}
        filename={'Cancelled-leave.csv'}
        className="btn btn-outline-primary mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Leave</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Date posted</th>
              <th>Date reviewed</th>
            </tr>
          </thead>
          <tbody>{cancelledRecordItems}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <div
      className="card card-body border-0"
      style={{ paddingTop: '100px', paddingBottom: '260px' }}
    >
      <h1 className="display-4 text-center">
        <em>There is no record to display.</em>
      </h1>
    </div>
  );
};

const DeclinedLeaveReportList = props => {
  const declinedRecord = props.declined_record.map(a => a).sort((b, c) => {
    return b.userId - c.userId;
  });

  const declinedRecordItems = declinedRecord.map(record => (
    <tr key={record.id}>
      <td>
        {record.user.othernames} {record.user.surname}
      </td>
      <td>{record.leaveName}</td>
      <td>{record.leaveType}</td>
      <td>{record.startDate}</td>
      <td>{record.endDate}</td>
      <td>{record.leaveStatus}</td>
      <td>{record.declinedReason}</td>
      <td>{record.datePosted}</td>
      <td>{record.dateReviewed}</td>
    </tr>
  ));

  return declinedRecordItems.length > 0 ? (
    <div>
      <CSVLink
        data={declinedRecord}
        filename={'Declined-leave.csv'}
        className="btn btn-outline-primary mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Leave</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Date posted</th>
              <th>Date reviewed</th>
            </tr>
          </thead>
          <tbody>{declinedRecordItems}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <div
      className="card card-body border-0"
      style={{ paddingTop: '100px', paddingBottom: '260px' }}
    >
      <h1 className="display-4 text-center">
        <em>There is no record to display.</em>
      </h1>
    </div>
  );
};

const UserUpdatesReportList = props => {
  const userUpdates = props.user_updates.map(a => a).sort((b, c) => {
    return b.userId - c.userId;
  });

  const userUpdateItems = userUpdates.map(record => {
    let dob = new Date(record.dateOfBirth);
    let dateOfBirth = moment(dob).format('DD/MM/YYYY');

    return (
      <tr key={record.id}>
        <td>
          {record.user.othernames} {record.user.surname}
        </td>
        <td>{record.annual}</td>
        <td>{record.sick}</td>
        <td>{record.bereavement}</td>
        <td>{record.christmas}</td>
        <td>{record.maternity}</td>
        <td>{record.designation}</td>
        <td>{dateOfBirth}</td>
        <td>{record.gender}</td>
        <td>{record.editReason}</td>
        <td>{record.datePosted}</td>
      </tr>
    );
  });

  return userUpdateItems.length > 0 ? (
    <div>
      <CSVLink
        data={userUpdates}
        filename={'User-updates.csv'}
        className="btn btn-outline-primary mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Annual </th>
              <th>Sick</th>
              <th>Bereavement</th>
              <th>Christmas</th>
              <th>Maternity</th>
              <th>Designation</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Reason</th>
              <th>Date posted</th>
            </tr>
          </thead>
          <tbody>{userUpdateItems}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <div
      className="card card-body border-0"
      style={{ paddingTop: '100px', paddingBottom: '260px' }}
    >
      <h1 className="display-4 text-center">
        <em>There is no record to display.</em>
      </h1>
    </div>
  );
};

const LeaveUpdatesReportList = props => {
  const leaveUpdates = props.leave_updates.map(a => a).sort((b, c) => {
    return b.leaveId - c.leaveId;
  });

  const leaveUpdateItems = leaveUpdates.map(record => (
    <tr key={record.id}>
      <td>{record.leaveId}</td>
      <td>
        {record.leaverecord.user.othernames} {record.leaverecord.user.surname}
      </td>
      <td>{record.previousStartDate}</td>
      <td>{record.previousEndDate}</td>
      <td>{record.previousLeaveName}</td>
      <td>{record.previousLeaveDays}</td>
      <td>{record.updatedStartDate}</td>
      <td>{record.updatedEndDate}</td>
      <td>{record.updatedLeaveName}</td>
      <td>{record.updatedLeaveDays}</td>
      <td>{record.editReason}</td>
      <td>{record.datePosted}</td>
    </tr>
  ));

  return leaveUpdateItems.length > 0 ? (
    <div>
      <CSVLink
        data={leaveUpdates}
        filename={'Leave-updates.csv'}
        className="btn btn-outline-primary mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Previous start date</th>
              <th>Previous end date</th>
              <th>Previous leave</th>
              <th>Previous leave days</th>
              <th>Updated start date</th>
              <th>Updated end date</th>
              <th>Updated leave</th>
              <th>Updated leave days</th>
              <th>Reason</th>
              <th>Date posted</th>
            </tr>
          </thead>
          <tbody>{leaveUpdateItems}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <div
      className="card card-body border-0"
      style={{ paddingTop: '100px', paddingBottom: '260px' }}
    >
      <h1 className="display-4 text-center">
        <em>There is no record to display.</em>
      </h1>
    </div>
  );
};

type tabsProps = {
  data: Array<any>
};

type tabsState = {
  activeIndex: number
};

class Tabs extends Component<tabsProps, tabsState> {
  selectTabIndex: Function;

  constructor() {
    super();
    this.state = { activeIndex: 0 };

    this.selectTabIndex = this.selectTabIndex.bind(this);
  }

  selectTabIndex(e: SyntheticEvent<HTMLElement>) {
    this.setState({
      activeIndex: parseInt(e.currentTarget.id, 10)
    });
  }

  renderTabs() {
    return this.props.data.map((tab, index) => {
      const isActive = this.state.activeIndex === index;
      return (
        <div className="nav-item" key={index}>
          <div
            className={isActive ? 'nav-link active' : 'btn-link'}
            onClick={this.selectTabIndex}
            id={index}
          >
            {tab.label}
          </div>
        </div>
      );
    });
  }

  renderPanel() {
    return <div>{this.props.data[this.state.activeIndex].content}</div>;
  }

  render() {
    return (
      <div className="container">
        <nav
          className="nav nav-pills nav-fill"
          style={{ borderBottom: '4px solid #fff' }}
        >
          {this.renderTabs()}
        </nav>
        <div className="mt-3">{this.renderPanel()}</div>
      </div>
    );
  }
}

type Props = {
  cancelled_record: Object,
  declined_record: Object,
  approved_record: Object,
  pending_record: Object,
  user_updates: Object,
  leave_updates: Object
};

export default class LeaveReportList extends Component<Props> {
  render() {
    const tabData = [
      {
        label: 'Approved',
        content: (
          <ApprovedLeaveReportList
            approved_record={this.props.approved_record}
          />
        )
      },
      {
        label: 'Pending',
        content: (
          <PendingLeaveReportList pending_record={this.props.pending_record} />
        )
      },
      {
        label: 'Cancelled',
        content: (
          <CancelledLeaveReportList
            cancelled_record={this.props.cancelled_record}
          />
        )
      },
      {
        label: 'Declined',
        content: (
          <DeclinedLeaveReportList
            declined_record={this.props.declined_record}
          />
        )
      },
      {
        label: 'User updates',
        content: (
          <UserUpdatesReportList user_updates={this.props.user_updates} />
        )
      },
      {
        label: 'Leave updates',
        content: (
          <LeaveUpdatesReportList leave_updates={this.props.leave_updates} />
        )
      }
    ];

    return <Tabs data={tabData} />;
  }
}
