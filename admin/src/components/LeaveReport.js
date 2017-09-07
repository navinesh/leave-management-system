// @flow
import React, { Component } from 'react';

import { CSVLink } from 'react-csv';

const moment = require('moment');

const ApprovedLeaveReportList = props => {
  const approvedRecord = props.approved_record.sort((a, b) => {
    return a.user_id - b.user_id;
  });

  const itemNodes = approvedRecord.map(record =>
    <tr key={record.id}>
      <td>
        {record.othernames} {record.surname}
      </td>
      <td>
        {record.leave_name}
      </td>
      <td>
        {record.leave_type}
      </td>
      <td>
        {record.start_date}
      </td>
      <td>
        {record.end_date}
      </td>
      <td>
        {record.leave_status}
      </td>
      <td>
        {record.date_posted}
      </td>
      <td>
        {record.date_reviewed}
      </td>
      <td>
        {record.leave_reason}
      </td>
    </tr>
  );

  return itemNodes.length > 0
    ? <div className="table-responsive">
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
              <th>Date posted</th>
              <th>Date reviewed</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {itemNodes}
          </tbody>
        </table>
      </div>
    : <div
        className="card card-body border-0"
        style={{ paddingTop: '100px', paddingBottom: '260px' }}
      >
        <h1 className="display-4 text-center">
          <em>There is no record to display.</em>
        </h1>
      </div>;
};

const PendingLeaveReportList = props => {
  const pendingRecord = props.pending_record.sort((a, b) => {
    return a.user_id - b.user_id;
  });

  const itemNodes = pendingRecord.map(record =>
    <tr key={record.id}>
      <td>
        {record.othernames} {record.surname}
      </td>
      <td>
        {record.leave_name}
      </td>
      <td>
        {record.leave_type}
      </td>
      <td>
        {record.start_date}
      </td>
      <td>
        {record.end_date}
      </td>
      <td>
        {record.leave_status}
      </td>
      <td>
        {record.date_posted}
      </td>
      <td>
        {record.date_reviewed}
      </td>
      <td>
        {record.leave_reason}
      </td>
    </tr>
  );

  return itemNodes.length > 0
    ? <div className="table-responsive">
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
              <th>Date posted</th>
              <th>Date reviewed</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {itemNodes}
          </tbody>
        </table>
      </div>
    : <div
        className="card card-body border-0"
        style={{ paddingTop: '100px', paddingBottom: '260px' }}
      >
        <h1 className="display-4 text-center">
          <em>There is no record to display.</em>
        </h1>
      </div>;
};

const CancelledLeaveReportList = props => {
  const cancelledRecord = props.cancelled_record.sort((a, b) => {
    return a.user_id - b.user_id;
  });

  const itemNodes = cancelledRecord.map(record =>
    <tr key={record.id}>
      <td>
        {record.othernames} {record.surname}
      </td>
      <td>
        {record.leave_name}
      </td>
      <td>
        {record.leave_type}
      </td>
      <td>
        {record.start_date}
      </td>
      <td>
        {record.end_date}
      </td>
      <td>
        {record.leave_status}
      </td>
      <td>
        {record.date_posted}
      </td>
      <td>
        {record.date_reviewed}
      </td>
      <td>
        {record.cancelled_reason}
      </td>
    </tr>
  );

  return itemNodes.length > 0
    ? <div>
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
                <th>Date posted</th>
                <th>Date reviewed</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {itemNodes}
            </tbody>
          </table>
        </div>
      </div>
    : <div
        className="card card-body border-0"
        style={{ paddingTop: '100px', paddingBottom: '260px' }}
      >
        <h1 className="display-4 text-center">
          <em>There is no record to display.</em>
        </h1>
      </div>;
};

const DeclinedLeaveReportList = props => {
  const declinedRecord = props.declined_record.sort((a, b) => {
    return a.user_id - b.user_id;
  });

  const itemNodes = declinedRecord.map(record =>
    <tr key={record.id}>
      <td>
        {record.othernames} {record.surname}
      </td>
      <td>
        {record.leave_name}
      </td>
      <td>
        {record.leave_type}
      </td>
      <td>
        {record.start_date}
      </td>
      <td>
        {record.end_date}
      </td>
      <td>
        {record.leave_status}
      </td>
      <td>
        {record.date_posted}
      </td>
      <td>
        {record.date_reviewed}
      </td>
      <td>
        {record.declined_reason}
      </td>
    </tr>
  );

  return itemNodes.length > 0
    ? <div>
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
                <th>Date posted</th>
                <th>Date reviewed</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {itemNodes}
            </tbody>
          </table>
        </div>
      </div>
    : <div
        className="card card-body border-0"
        style={{ paddingTop: '100px', paddingBottom: '260px' }}
      >
        <h1 className="display-4 text-center">
          <em>There is no record to display.</em>
        </h1>
      </div>;
};

const UserUpdatesReportList = props => {
  const userUpdates = props.user_updates.sort((a, b) => {
    return a.user_id - b.user_id;
  });

  const itemNodes = userUpdates.map(record => {
    let dob = new Date(record.date_of_birth);
    let dateOfBirth = moment(dob).format('DD/MM/YYYY');

    return (
      <tr key={record.id}>
        <td>
          {record.othernames} {record.surname}
        </td>
        <td>
          {record.annual}
        </td>
        <td>
          {record.sick}
        </td>
        <td>
          {record.bereavement}
        </td>
        <td>
          {record.christmas}
        </td>
        <td>
          {record.maternity}
        </td>
        <td>
          {record.designation}
        </td>
        <td>
          {dateOfBirth}
        </td>
        <td>
          {record.gender}
        </td>
        <td>
          {record.editReason}
        </td>
        <td>
          {record.date_posted}
        </td>
      </tr>
    );
  });

  return itemNodes.length > 0
    ? <div>
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
            <tbody>
              {itemNodes}
            </tbody>
          </table>
        </div>
      </div>
    : <div
        className="card card-body border-0"
        style={{ paddingTop: '100px', paddingBottom: '260px' }}
      >
        <h1 className="display-4 text-center">
          <em>There is no record to display.</em>
        </h1>
      </div>;
};

const LeaveUpdatesReportList = props => {
  const leaveUpdates = props.leave_updates.sort((a, b) => {
    return a.leave_id - b.leave_id;
  });

  const itemNodes = leaveUpdates.map(record =>
    <tr key={record.id}>
      <td>
        {record.leave_id}
      </td>
      <td>
        {record.othernames} {record.surname}
      </td>
      <td>
        {record.previous_start_date}
      </td>
      <td>
        {record.previous_end_date}
      </td>
      <td>
        {record.previous_leave_name}
      </td>
      <td>
        {record.previous_leave_days}
      </td>
      <td>
        {record.updated_start_date}
      </td>
      <td>
        {record.updated_end_date}
      </td>
      <td>
        {record.updated_leave_name}
      </td>
      <td>
        {record.updated_leave_days}
      </td>
      <td>
        {record.date_posted}
      </td>
      <td>
        {record.editReason}
      </td>
    </tr>
  );

  return itemNodes.length > 0
    ? <div>
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
                <th>Date posted</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {itemNodes}
            </tbody>
          </table>
        </div>
      </div>
    : <div
        className="card card-body border-0"
        style={{ paddingTop: '100px', paddingBottom: '260px' }}
      >
        <h1 className="display-4 text-center">
          <em>There is no record to display.</em>
        </h1>
      </div>;
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

  selectTabIndex(e: Event & { currentTarget: HTMLElement }) {
    this.setState({
      activeIndex: e.currentTarget.id ? parseInt(e.currentTarget.id, 10) : 0
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
    return (
      <div>
        {this.props.data[this.state.activeIndex].content}
      </div>
    );
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
        <div className="mt-3">
          {this.renderPanel()}
        </div>
      </div>
    );
  }
}

type Props = {
  cancelled_record: Array<any>,
  declined_record: Array<any>,
  approved_record: Array<any>,
  pending_record: Array<any>,
  user_updates: Array<any>,
  leave_updates: Array<any>
};

class LeaveReportList extends Component<Props> {
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

export default LeaveReportList;
