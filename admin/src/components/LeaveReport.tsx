import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { CSVLink } from 'react-csv';

import { DocumentNode } from 'graphql';

const moment = require('moment');

const UNARCHIVE_RECORD = gql`
  mutation unarchiveLeaveRecord($id: String!) {
    unarchiveLeaverecord(id: $id) {
      ok
    }
  }
`;

interface ArchivedRecordProps {
  id: string;
  ARCHIVED_RECORD: DocumentNode;
}

function UnarchiveLeaveRecord(props: ArchivedRecordProps): JSX.Element {
  const [unarchiveLeaverecord, { loading, error }] = useMutation(
    UNARCHIVE_RECORD,
    {
      variables: { id: props.id },
      refetchQueries: [{ query: props.ARCHIVED_RECORD }]
    }
  );

  if (loading) {
    return <span className="ml-2 font-italic text-primary">Loading...</span>;
  }

  if (error) {
    console.log(error);
    return <span className="ml-2 font-italic text-warning">Error...</span>;
  }

  return (
    <button
      className="btn btn-link btn-sm text-primary"
      onClick={() => unarchiveLeaverecord()}
    >
      Unarchive
    </button>
  );
}

interface LeaveData {
  id: string;
  leaveName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  leaveStatus: string;
  datePosted: string;
}

interface User {
  othernames: string;
  surname: string;
}

interface PendingLeaveProps {
  pending_record: Array<PendingLeaveData>;
}

interface PendingLeaveData extends LeaveData {
  leaveReason: string;
  user: User;
}

export function PendingLeaveReportList(props: PendingLeaveProps): JSX.Element {
  const pendingRecord = props.pending_record
    .map(a => a)
    .sort((a, b) => {
      return a.user.othernames.localeCompare(b.user.othernames);
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
      <td>{record.leaveDays}</td>
      <td>{record.leaveStatus}</td>
      <td>{record.leaveReason}</td>
      <td>{record.datePosted}</td>
    </tr>
  ));

  const records = pendingRecord.map(a => {
    var rObj: any = {};
    rObj['Othernames'] = a.user.othernames;
    rObj['Surname'] = a.user.surname;
    rObj['Leave'] = a.leaveName;
    rObj['Type'] = a.leaveType;
    rObj['Start date'] = a.startDate;
    rObj['End date'] = a.endDate;
    rObj['Leave days'] = a.leaveDays;
    rObj['Status'] = a.leaveStatus;
    rObj['Leave reason'] = a.leaveReason;
    rObj['Date posted'] = a.datePosted;
    return rObj;
  });

  return pendingRecordItems.length > 0 ? (
    <>
      <CSVLink
        data={records}
        filename={'Pending-leave.csv'}
        className="btn btn-primary btn-sm mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Leave</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Leave days</th>
              <th>Status</th>
              <th>Leave reason</th>
              <th>Date posted</th>
            </tr>
          </thead>
          <tbody>{pendingRecordItems}</tbody>
        </table>
      </div>
    </>
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
}

interface ApprovedLeaveProps {
  approved_record: Array<ApprovedLeaveData>;
}

interface ApprovedLeaveData extends LeaveData {
  userId: number;
  leaveReason: string;
  dateReviewed: string;
  user: ApprovedUser;
}

interface ApprovedUser extends User {
  employeeNumber: number;
}

export function ApprovedLeaveReportList(
  props: ApprovedLeaveProps
): JSX.Element {
  const approvedRecord = props.approved_record
    .map(a => a)
    .sort((a, b) => {
      return a.user.othernames.localeCompare(b.user.othernames);
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
      <td>{record.leaveDays}</td>
      <td>{record.leaveStatus}</td>
      <td>{record.leaveReason}</td>
      <td>{record.datePosted}</td>
      <td>{record.dateReviewed}</td>
    </tr>
  ));

  const records = approvedRecord.map(a => {
    var rObj: any = {};
    rObj['Othernames'] = a.user.othernames;
    rObj['Surname'] = a.user.surname;
    rObj['Employee #'] = a.user.employeeNumber;
    rObj['Leave'] = a.leaveName;
    rObj['Type'] = a.leaveType;
    rObj['Start date'] = a.startDate;
    rObj['End date'] = a.endDate;
    rObj['Leave days'] = a.leaveDays;
    rObj['Status'] = a.leaveStatus;
    rObj['Leave reason'] = a.leaveReason;
    rObj['Date posted'] = a.datePosted;
    rObj['Date reviewed'] = a.dateReviewed;
    return rObj;
  });

  return approvedRecordItems.length > 0 ? (
    <>
      <CSVLink
        data={records}
        filename={'Approved-leave.csv'}
        className="btn btn-primary btn-sm mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Leave</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Leave days</th>
              <th>Status</th>
              <th>Leave reason</th>
              <th>Date posted</th>
              <th>Date reviewed</th>
            </tr>
          </thead>
          <tbody>{approvedRecordItems}</tbody>
        </table>
      </div>
    </>
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
}

interface CancelledLeaveProps {
  cancelled_record: Array<CancelledLeaveData>;
}

interface CancelledLeaveData extends LeaveData {
  cancelledReason: string;
  dateReviewed: string;
  user: User;
}

export function CancelledLeaveReportList(
  props: CancelledLeaveProps
): JSX.Element {
  const cancelledRecord = props.cancelled_record
    .map(a => a)
    .sort((a, b) => {
      return a.user.othernames.localeCompare(b.user.othernames);
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
      <td>{record.leaveDays}</td>
      <td>{record.leaveStatus}</td>
      <td>{record.cancelledReason}</td>
      <td>{record.datePosted}</td>
      <td>{record.dateReviewed}</td>
    </tr>
  ));

  const records = cancelledRecord.map(a => {
    var rObj: any = {};
    rObj['Othernames'] = a.user.othernames;
    rObj['Surname'] = a.user.surname;
    rObj['Leave'] = a.leaveName;
    rObj['Type'] = a.leaveType;
    rObj['Start date'] = a.startDate;
    rObj['End date'] = a.endDate;
    rObj['Leave days'] = a.leaveDays;
    rObj['Status'] = a.leaveStatus;
    rObj['Cancelled reason'] = a.cancelledReason;
    rObj['Date posted'] = a.datePosted;
    rObj['Date reviewed'] = a.dateReviewed;
    return rObj;
  });

  return cancelledRecordItems.length > 0 ? (
    <>
      <CSVLink
        data={records}
        filename={'Cancelled-leave.csv'}
        className="btn btn-primary btn-sm mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Leave</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Leave days</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Date posted</th>
              <th>Date reviewed</th>
            </tr>
          </thead>
          <tbody>{cancelledRecordItems}</tbody>
        </table>
      </div>
    </>
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
}

interface DeclinedLeaveProps {
  declined_record: Array<DeclinedLeaveData>;
}

interface DeclinedLeaveData extends LeaveData {
  declinedReason: string;
  dateReviewed: string;
  user: User;
}

export function DeclinedLeaveReportList(
  props: DeclinedLeaveProps
): JSX.Element {
  const declinedRecord = props.declined_record
    .map(a => a)
    .sort((a, b) => {
      return a.user.othernames.localeCompare(b.user.othernames);
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
      <td>{record.leaveDays}</td>
      <td>{record.leaveStatus}</td>
      <td>{record.declinedReason}</td>
      <td>{record.datePosted}</td>
      <td>{record.dateReviewed}</td>
    </tr>
  ));

  const records = declinedRecord.map(a => {
    var rObj: any = {};
    rObj['Othernames'] = a.user.othernames;
    rObj['Surname'] = a.user.surname;
    rObj['Leave'] = a.leaveName;
    rObj['Type'] = a.leaveType;
    rObj['Start date'] = a.startDate;
    rObj['End date'] = a.endDate;
    rObj['Leave days'] = a.leaveDays;
    rObj['Status'] = a.leaveStatus;
    rObj['Declined reason'] = a.declinedReason;
    rObj['Date posted'] = a.datePosted;
    rObj['Date reviewed'] = a.dateReviewed;
    return rObj;
  });

  return declinedRecordItems.length > 0 ? (
    <>
      <CSVLink
        data={records}
        filename={'Declined-leave.csv'}
        className="btn btn-primary btn-sm mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Leave</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Leave days</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Date posted</th>
              <th>Date reviewed</th>
            </tr>
          </thead>
          <tbody>{declinedRecordItems}</tbody>
        </table>
      </div>
    </>
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
}

interface ArchivedLeaveProps {
  archived_record: Array<ArchivedLeaveData>;
  ARCHIVED_RECORDS: DocumentNode;
}

interface ArchivedLeaveData extends LeaveData {
  userId: number;
  leaveReason: string;
  dateReviewed: string;
  user: ArchivedUser;
}

interface ArchivedUser extends User {
  employeeNumber: number;
}

export function ArchivedLeaveReportList(
  props: ArchivedLeaveProps
): JSX.Element {
  const archivedRecord = props.archived_record
    .map(a => a)
    .sort((a, b) => {
      return a.user.othernames.localeCompare(b.user.othernames);
    });

  const archivedRecordItems = archivedRecord.map(record => (
    <tr key={record.id}>
      <td>
        {record.user.othernames} {record.user.surname}
      </td>
      <td>{record.leaveName}</td>
      <td>{record.leaveType}</td>
      <td>{record.startDate}</td>
      <td>{record.endDate}</td>
      <td>{record.leaveDays}</td>
      <td>{record.leaveStatus}</td>
      <td>{record.leaveReason}</td>
      <td>
        <UnarchiveLeaveRecord
          id={record.id}
          ARCHIVED_RECORD={props.ARCHIVED_RECORDS}
        />
      </td>
    </tr>
  ));

  const records = archivedRecord.map(a => {
    var rObj: any = {};
    rObj['Othernames'] = a.user.othernames;
    rObj['Surname'] = a.user.surname;
    rObj['Employee #'] = a.user.employeeNumber;
    rObj['Leave'] = a.leaveName;
    rObj['Type'] = a.leaveType;
    rObj['Start date'] = a.startDate;
    rObj['End date'] = a.endDate;
    rObj['Leave days'] = a.leaveDays;
    rObj['Status'] = a.leaveStatus;
    rObj['Leave reason'] = a.leaveReason;
    rObj['Date posted'] = a.datePosted;
    rObj['Date reviewed'] = a.dateReviewed;
    return rObj;
  });

  return archivedRecordItems.length > 0 ? (
    <>
      <CSVLink
        data={records}
        filename={'Archived-leave.csv'}
        className="btn btn-primary btn-sm mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Leave</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Leave days</th>
              <th>Status</th>
              <th>Leave reason</th>
              <th>Unarchive</th>
            </tr>
          </thead>
          <tbody>{archivedRecordItems}</tbody>
        </table>
      </div>
    </>
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
}

interface LeaveUpdatesProps {
  leave_updates: Array<LeaveUpdatesData>;
}

interface LeaveUpdatesData extends LeaveData {
  id: string;
  leaveId: number;
  previousStartDate: string;
  previousEndDate: string;
  previousLeaveName: string;
  previousLeaveDays: number;
  updatedStartDate: string;
  updatedEndDate: string;
  updatedLeaveName: string;
  updatedLeaveDays: number;
  editReason: string;
  leaverecord: LeaveRecordData;
}

interface LeaveRecordData {
  user: User;
}

export function LeaveUpdatesReportList(props: LeaveUpdatesProps): JSX.Element {
  const leaveUpdates = props.leave_updates
    .map(a => a)
    .sort((b, c) => {
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

  const records = props.leave_updates.map(a => {
    var rObj: any = {};
    rObj['Othernames'] = a.leaverecord.user.othernames;
    rObj['Surname'] = a.leaverecord.user.surname;
    rObj['Previous start date'] = a.previousStartDate;
    rObj['Previous end date'] = a.previousEndDate;
    rObj['Previous leave name'] = a.previousLeaveName;
    rObj['Previous leave days'] = a.previousLeaveDays;
    rObj['Updated start date'] = a.updatedStartDate;
    rObj['Updated end date'] = a.updatedEndDate;
    rObj['Updated leave name'] = a.updatedLeaveName;
    rObj['Updated leave days'] = a.updatedLeaveDays;
    rObj['Edit reason'] = a.editReason;
    rObj['Date posted'] = a.datePosted;
    return rObj;
  });

  return leaveUpdateItems.length > 0 ? (
    <>
      <CSVLink
        data={records}
        filename={'Leave-updates.csv'}
        className="btn btn-primary btn-sm mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
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
    </>
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
}

interface StaffRecordProps {
  staff_record: Array<UserRecordProps>;
}

interface UserRecordProps extends User {
  id: string;
  annual: number;
  sick: number;
  bereavement: number;
  familyCare: number;
  christmas: number;
  maternity: number;
  paternity: number;
  employeeNumber: number;
  employeeStartDate: string;
}

export function StaffRecordList(props: StaffRecordProps): JSX.Element {
  const staffRecordList = props.staff_record
    .map(a => a)
    .sort((a, b) => {
      return a.othernames.localeCompare(b.othernames);
    });

  const staffRecordItems = staffRecordList.map(record => (
    <tr key={record.id}>
      <td>
        {record.othernames} {record.surname}
      </td>
      <td>{record.annual}</td>
      <td>{record.sick}</td>
      <td>{record.bereavement}</td>
      <td>{record.familyCare}</td>
      <td>{record.christmas}</td>
      <td>{record.maternity}</td>
      <td>{record.paternity}</td>
      <td>{record.employeeNumber}</td>
      <td>{record.employeeStartDate}</td>
    </tr>
  ));

  const records = staffRecordList.map(a => {
    var rObj: any = {};
    rObj['Othernames'] = a.othernames;
    rObj['Surname'] = a.surname;
    rObj['Annual'] = a.annual;
    rObj['Sick'] = a.sick;
    rObj['Bereavement'] = a.bereavement;
    rObj['Family care'] = a.familyCare;
    rObj['Christmas'] = a.christmas;
    rObj['Maternity'] = a.maternity;
    rObj['Paternity'] = a.paternity;
    rObj['employeeNumber'] = a.employeeNumber;
    rObj['employeeStartDate'] = a.employeeStartDate;
    return rObj;
  });

  return staffRecordItems.length > 0 ? (
    <>
      <CSVLink
        data={records}
        filename={'User-record.csv'}
        className="btn btn-primary btn-sm mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Annual </th>
              <th>Sick</th>
              <th>Bereavement</th>
              <th>Family care</th>
              <th>Christmas</th>
              <th>Maternity</th>
              <th>Paternity</th>
              <th>Employee #</th>
              <th>Start date</th>
            </tr>
          </thead>
          <tbody>{staffRecordItems}</tbody>
        </table>
      </div>
    </>
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
}

interface UserUpdatesProps {
  user_updates: Array<{
    id: string;
    userId: number;
    annual: number;
    sick: number;
    bereavement: number;
    familyCare: number;
    christmas: number;
    maternity: number;
    paternity: number;
    designation: string;
    dateOfBirth: string;
    gender: string;
    editReason: string;
    datePosted: string;
    user: User;
  }>;
}

export function UserUpdatesReportList(props: UserUpdatesProps): JSX.Element {
  const userUpdates = props.user_updates
    .map(a => a)
    .sort((b, c) => {
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
        <td>{record.familyCare}</td>
        <td>{record.christmas}</td>
        <td>{record.maternity}</td>
        <td>{record.paternity}</td>
        <td>{record.designation}</td>
        <td>{dateOfBirth}</td>
        <td>{record.gender}</td>
        <td>{record.editReason}</td>
      </tr>
    );
  });

  const records = props.user_updates.map(a => {
    var rObj: any = {};
    rObj['Othernames'] = a.user.othernames;
    rObj['Surname'] = a.user.surname;
    rObj['Annual'] = a.annual;
    rObj['Sick'] = a.sick;
    rObj['Bereavement'] = a.bereavement;
    rObj['Family care'] = a.familyCare;
    rObj['Christmas'] = a.christmas;
    rObj['Maternity'] = a.maternity;
    rObj['Paternity'] = a.paternity;
    rObj['Designation'] = a.designation;
    rObj['Date Of Birth'] = a.dateOfBirth;
    rObj['Gender'] = a.gender;
    rObj['Edit reason'] = a.editReason;
    rObj['Date posted'] = a.datePosted;
    return rObj;
  });

  return userUpdateItems.length > 0 ? (
    <>
      <CSVLink
        data={records}
        filename={'User-updates.csv'}
        className="btn btn-primary btn-sm mb-2"
      >
        Download
      </CSVLink>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Annual </th>
              <th>Sick</th>
              <th>Bereavement</th>
              <th>Family care</th>
              <th>Christmas</th>
              <th>Maternity</th>
              <th>Paternity</th>
              <th>Designation</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>{userUpdateItems}</tbody>
        </table>
      </div>
    </>
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
}
