import React, { useState, useRef } from 'react';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, FocusedInputShape } from 'react-dates';

import axios from 'axios';

import done_all from '../img/done_all.png';

import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

interface ApproveProps {
  pending_items: Array<UserRecord>;
  listID: string;
  handleCloseApproveLeave: React.MouseEventHandler<HTMLButtonElement>;
}

interface UserRecord {
  id: string;
  dbId: number;
  leaveDays: number;
  leaveName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveReason: string;
  user: User;
}

interface User {
  othernames: string;
  surname: string;
}

interface ApproveLeaveDataProps {
  leaveID: number;
  leaveStatus: string;
  leaveDays: number;
  leaveName: string;
  adminUser: string | null;
}

function ApproveLeave(props: ApproveProps): JSX.Element {
  const [serverMessage, setServerMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  function handleApproveLeaveSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const { pending_items, listID } = props;

    const leaveStatus = 'approved';

    if (!listID) {
      setErrorMessage('Could not get id!');
      return;
    }

    const userRecord = pending_items.filter(e => e.id === listID);

    const leaveID = userRecord[0].dbId;
    const leaveDays = userRecord[0].leaveDays;
    const leaveName = userRecord[0].leaveName;
    const adminUser = localStorage.getItem('admin_user');

    setErrorMessage('');

    const approveLeaveData = {
      leaveID: leaveID,
      leaveStatus: leaveStatus,
      leaveDays: leaveDays,
      leaveName: leaveName,
      adminUser: adminUser
    };

    approveLeave(approveLeaveData);
  }

  async function approveLeave(
    approveLeaveData: ApproveLeaveDataProps
  ): Promise<any> {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/approveleave', {
        leave_id: approveLeaveData.leaveID,
        leaveStatus: approveLeaveData.leaveStatus,
        leaveDays: approveLeaveData.leaveDays,
        leaveName: approveLeaveData.leaveName,
        admin_user: approveLeaveData.adminUser
      });

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data.message);
      } else {
        setServerMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  const { pending_items, listID, handleCloseApproveLeave } = props;

  return (
    <div className="col-md-10 ml-auto mr-auto">
      {pending_items
        .filter(e => e.id === listID)
        .map(record => (
          <div key={record.id}>
            <div
              className="col-md-6 ml-auto mr-auto"
              style={{ paddingTop: '10px' }}
            >
              <div className="card">
                <h5 className="card-header">Approve</h5>
                <div className="card-body">
                  <p>
                    {record.user.othernames} {record.user.surname}
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Leave</label>
                        <div className="form-control">
                          <em>{record.leaveName}</em>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Leave type</label>
                        <div className="form-control">
                          <em>{record.leaveType}</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Start date</label>
                        <div className="form-control">
                          <em>{record.startDate}</em>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>End date</label>
                        <div className="form-control">
                          <em>{record.endDate}</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Leave days</label>
                        <div className="form-control text-muted">
                          <em>{record.leaveDays}</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label>Leave reason</label>
                        <div className="text-muted">
                          <em>{record.leaveReason}</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleApproveLeaveSubmit}>
                    <div className="row justify-content-end">
                      <button type="submit" className="btn btn-primary mr-3">
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleCloseApproveLeave}
                      >
                        Close
                      </button>
                    </div>
                    <div className="text-primary text-center">
                      {loading ? (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <p className="mt-3">{serverMessage}</p>
                      )}
                    </div>
                    <div className="text-danger text-center">
                      <div className="mt-3">{errorMessage}</div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

interface DeclineProps {
  pending_items: Array<UserRecord>;
  listID: string;
  handleCloseDecline: React.MouseEventHandler<HTMLButtonElement>;
}

interface DeclineLeaveDataProps {
  leaveID: number;
  LeaveStatus: string;
  DeclineReason: string;
  adminUser: string | null;
}

function DeclineLeave(props: DeclineProps): JSX.Element {
  const [declineReason, setDeclineReason] = useState<string>('');
  const [serverMessage, setServerMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  function handleDeclineReason({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setDeclineReason(target.value);
  }

  function handleDeclineSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const { pending_items, listID } = props;

    const reason = declineReason ? declineReason.trim() : null;

    if (!reason) {
      setErrorMessage('Reason field is mandatory!');
      return;
    }

    const userRecord = pending_items.filter(e => e.id === listID);
    const leaveID = userRecord[0].dbId;
    const adminUser = localStorage.getItem('admin_user');

    setErrorMessage('');

    const declineLeaveData = {
      leaveID: leaveID,
      LeaveStatus: 'declined',
      DeclineReason: reason,
      adminUser: adminUser
    };

    declineLeave(declineLeaveData);
  }

  async function declineLeave(
    declineLeaveData: DeclineLeaveDataProps
  ): Promise<any> {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/declineleave', {
        leave_id: declineLeaveData.leaveID,
        LeaveStatus: declineLeaveData.LeaveStatus,
        DeclineReason: declineLeaveData.DeclineReason,
        admin_user: declineLeaveData.adminUser
      });

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data.message);
      } else {
        setServerMessage(response.data.message);
        setDeclineReason('');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  const { pending_items, listID, handleCloseDecline } = props;

  return (
    <div>
      {pending_items
        .filter(e => e.id === listID)
        .map(record => (
          <div key={record.id}>
            <div
              className="col-md-6 ml-auto mr-auto pb-2"
              style={{ paddingTop: '10px' }}
            >
              <div className="card">
                <h5 className="card-header">Decline</h5>
                <div className="card-body">
                  <p>
                    {record.user.othernames} {record.user.surname}
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Leave</label>
                        <div className="form-control">
                          <em>{record.leaveName}</em>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Leave type</label>
                        <div className="form-control">
                          <em>{record.leaveType}</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Start date</label>
                        <div className="form-control">
                          <em>{record.startDate}</em>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>End date</label>
                        <div className="form-control">
                          <em>{record.endDate}</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Leave days</label>
                        <div className="form-control">
                          <em>{record.leaveDays}</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label>Leave reason</label>
                        <div className="form-control">
                          <em>{record.leaveReason}</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleDeclineSubmit}>
                    <div className="form-group">
                      <label htmlFor="reason">Decline reason</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter reason"
                        id="reason"
                        onChange={handleDeclineReason}
                      />
                    </div>
                    <div className="row justify-content-end">
                      <button type="submit" className="btn btn-primary mr-3">
                        Decline
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleCloseDecline}
                      >
                        Close
                      </button>
                    </div>
                    <div className="text-primary text-center">
                      {loading ? (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <p className="mt-3">{serverMessage}</p>
                      )}
                    </div>
                    <div className="text-danger text-center">
                      <div className="mt-3">{errorMessage}</div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

interface EditProps {
  pending_items: Array<PendingItems>;
  public_holiday: PublicHolidayType;
  listID: string;
  handleCloseEdit: React.MouseEventHandler<HTMLButtonElement>;
}

interface PendingItems {
  id: string;
  dbId: number;
  leaveName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  leaveReason: string;
  leaveStatus: string;
  user: UserData;
}

interface UserData extends User {
  annual: number;
  sick: number;
  bereavement: number;
  christmas: number;
  familyCare: number;
  maternity: number;
  paternity: number;
  date_of_birth: string;
  gender: string;
}

interface PublicHolidayType {
  edges: Array<Holiday>;
}

interface Holiday {
  node: HolidayData;
}

interface HolidayData {
  holidayDate: string;
}

interface EditLeaveDataProps {
  leave_id: number;
  leave: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveDays: number;
  previousLeaveDays: number;
  previousLeaveName: string;
  previousLeaveType: string;
  previousStartDate: string;
  previousEndDate: string;
  adminUser: string | null;
}

type TotalDaysType = {
  [key: string]: any;
};

function EditLeave(props: EditProps): JSX.Element {
  const [editReason, setEditReason] = useState<string>('');
  const dbLeaveName = useRef<any>(null);
  const dbLeaveType = useRef<any>(null);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const dbStartDate = useRef<any>(null);
  const dbEndDate = useRef<any>(null);
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(
    null
  );
  const [serverMessage, setServerMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  function handleEditReason({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setEditReason(target.value);
  }

  function handleEditSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const { pending_items, public_holiday, listID } = props;

    const leave = dbLeaveName.current.value;
    const leaveType = dbLeaveType.current.value;
    const userStartDate = startDate
      ? startDate
      : moment(dbStartDate.current.value, 'DD/MM/YYYY');
    const userEndDate = endDate
      ? endDate
      : moment(dbStartDate.current.value, 'DD/MM/YYYY');
    const reason = editReason ? editReason.trim() : null;

    const userRecord = pending_items.filter(e => e.id === listID);

    const annualDays = userRecord[0].user.annual;
    const sickDays = userRecord[0].user.sick;
    const bereavementDays = userRecord[0].user.bereavement;
    const christmasDays = userRecord[0].user.christmas;
    const familyCareDays = userRecord[0].user.familyCare;
    const maternityDays =
      userRecord[0].user.maternity && userRecord[0].user.maternity;
    const paternityDays =
      userRecord[0].user.paternity && userRecord[0].user.paternity;
    const dateOfBirth = userRecord[0].user.date_of_birth;

    const leaveID = userRecord[0].dbId;
    const previousLeaveDays = userRecord[0].leaveDays;
    const previousLeaveName = userRecord[0].leaveName;
    const previousLeaveType = userRecord[0].leaveType;
    const previousStartDate = userRecord[0].startDate;
    const previousEndDate = userRecord[0].endDate;

    if (
      !listID ||
      !leave ||
      !leaveType ||
      !userStartDate ||
      !userEndDate ||
      !reason
    ) {
      setErrorMessage('One of the mandatory fields is missing!');
      return;
    }

    // get date range from user selection
    const leaveRangeDays = userEndDate.diff(userStartDate, 'days') + 1;

    // check user data range selection
    if (leaveRangeDays <= 0) {
      setErrorMessage('The dates you selected are invalid!');
      return;
    }

    // create date range
    const range = moment.range(userStartDate, userEndDate);

    const dateRange: Array<any> = [];
    for (let numDays of range.by('days')) {
      dateRange.push(numDays.format('DD, MM, YYYY'));
    }

    const weekend: Array<any> = [];
    for (let numWeekends of range.by('days')) {
      if (numWeekends.isoWeekday() === 6 || numWeekends.isoWeekday() === 7) {
        weekend.push(numWeekends.format('DD, MM, YYYY'));
      }
    }

    // exclude weekends
    const dateRangeSet = new Set(dateRange);
    const weekendSet = new Set(weekend);
    const daysExcludingWeekendSet = new Set(
      [...dateRangeSet].filter(x => !weekendSet.has(x))
    );

    // exclude public holidays
    const publicHolidays = public_holiday.edges.map(item => {
      let hDate = new Date(item.node.holidayDate);
      let holiday_date = moment(hDate).format('DD, MM, YYYY');
      return holiday_date;
    });

    const publicHolidaysSet = new Set(publicHolidays);
    const daysExcludingHolidaysSet = new Set(
      [...daysExcludingWeekendSet].filter(x => !publicHolidaysSet.has(x))
    );
    const leaveDays = daysExcludingHolidaysSet.size;

    if (leaveDays === 0) {
      setErrorMessage(
        'The dates you selected either fall on public holiday, Saturday or Sunday!'
      );
      return;
    }

    // if half day then subtract 0.5
    const myLeaveDays =
      leaveType === 'half day am' || leaveType === 'half day pm'
        ? leaveDays - 0.5
        : leaveDays;

    // since maternity leave is for consecutive days, do not exclude weekends
    // or public holidays
    const myMaternityDays =
      leaveType === 'half day am' || leaveType === 'half day pm'
        ? leaveRangeDays - 0.5
        : leaveRangeDays;

    // calculate total leave days
    function getLeaveDays(type: string) {
      const totalDays: TotalDaysType = {
        annual: function() {
          return annualDays - myLeaveDays;
        },
        sick: function() {
          return sickDays - myLeaveDays;
        },
        bereavement: function() {
          return bereavementDays - myLeaveDays;
        },
        'family care': function() {
          return familyCareDays - myLeaveDays;
        },
        christmas: function() {
          return christmasDays - myLeaveDays;
        },
        birthday: function() {
          // create date
          const dOB: any = new Date(dateOfBirth);
          dOB.setHours(dOB.getHours() - 12);
          const birthDate = moment.utc(dOB);
          // check date of birth
          return moment(userStartDate).isSame(birthDate) &&
            moment(userEndDate).isSame(birthDate)
            ? myLeaveDays
            : undefined;
        },
        maternity: function() {
          return maternityDays - myMaternityDays;
        },
        paternity: function() {
          return paternityDays - myLeaveDays;
        },
        lwop: function() {
          return myLeaveDays;
        },
        other: function() {
          return myLeaveDays;
        }
      };
      return totalDays[type]();
    }

    const applicationDays = getLeaveDays(leave);

    if (applicationDays < 0) {
      setErrorMessage('Leave balance cannot be negative!');
      return;
    }

    if (applicationDays === undefined) {
      setErrorMessage(
        'The date you selected as date of birth does not match our record!'
      );
      return;
    }

    const sDate = moment(userStartDate).format('DD/MM/YYYY');
    const eDate = moment(userEndDate).format('DD/MM/YYYY');

    setErrorMessage('');

    const adminUser = localStorage.getItem('admin_user');

    const editLeaveData = {
      leave_id: leaveID,
      leave: leave,
      leaveType: leaveType,
      startDate: sDate,
      endDate: eDate,
      reason: reason,
      leaveDays: myLeaveDays,
      previousLeaveDays: previousLeaveDays,
      previousLeaveName: previousLeaveName,
      previousLeaveType: previousLeaveType,
      previousStartDate: previousStartDate,
      previousEndDate: previousEndDate,
      adminUser: adminUser
    };

    editLeave(editLeaveData);
  }

  async function editLeave(editLeaveData: EditLeaveDataProps): Promise<any> {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/editleave', {
        leave_id: editLeaveData.leave_id,
        leave: editLeaveData.leave,
        leaveType: editLeaveData.leaveType,
        startDate: editLeaveData.startDate,
        endDate: editLeaveData.endDate,
        reason: editLeaveData.reason,
        leaveDays: editLeaveData.leaveDays,
        previousLeaveDays: editLeaveData.previousLeaveDays,
        previousLeaveName: editLeaveData.previousLeaveName,
        previousLeaveType: editLeaveData.previousLeaveType,
        previousStartDate: editLeaveData.previousStartDate,
        previousEndDate: editLeaveData.previousEndDate,
        admin_user: editLeaveData.adminUser
      });

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data.message);
      } else {
        setServerMessage(response.data.message);
        setEditReason('');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  const { pending_items, listID, handleCloseEdit } = props;

  return (
    <>
      {pending_items
        .filter(e => e.id === listID)
        .map(record => (
          <div key={record.id}>
            <div
              className="col-md-6 ml-auto mr-auto"
              style={{ paddingTop: '10px' }}
            >
              <div className="card">
                <h5 className="card-header">Edit</h5>
                <div className="card-body">
                  <p>
                    {record.user.othernames} {record.user.surname}
                  </p>
                  <form
                    encType="multipart/form-data"
                    onSubmit={handleEditSubmit}
                  >
                    <div className="row">
                      <div className="col" />
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="leave">Leave</label>
                          <select
                            className="form-control"
                            id="leave"
                            defaultValue={record.leaveName}
                            ref={dbLeaveName}
                          >
                            <option>{record.leaveName}</option>
                            <option>annual</option>
                            <option>sick</option>
                            <option>bereavement</option>
                            <option>family care</option>
                            <option>christmas</option>
                            <option>birthday</option>
                            {record.user.gender.toLowerCase() === 'female' &&
                            record.user.maternity > 0 ? (
                              <option>maternity</option>
                            ) : null}
                            {record.user.gender.toLowerCase() === 'male' &&
                            record.user.paternity > 0 ? (
                              <option>paternity</option>
                            ) : null}
                            <option>lwop</option>
                            <option>other</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="leave type">Leave type</label>
                          <select
                            className="form-control"
                            id="leave type"
                            defaultValue={record.leaveType}
                            ref={dbLeaveType}
                          >
                            <option>{record.leaveType}</option>
                            <option>full</option>
                            <option>half day am</option>
                            <option>half day pm</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="startDate-endDate">
                            Start date - End date
                          </label>
                          <input
                            type="hidden"
                            defaultValue={record.startDate}
                            ref={dbStartDate}
                          />
                          <input
                            type="hidden"
                            defaultValue={record.endDate}
                            ref={dbEndDate}
                          />
                          <DateRangePicker
                            startDatePlaceholderText={record.startDate}
                            endDatePlaceholderText={record.endDate}
                            startDateId="start_date_id"
                            endDateId="end_date_id"
                            startDate={startDate}
                            endDate={endDate}
                            onDatesChange={({ startDate, endDate }) => {
                              setStartDate(startDate);
                              setEndDate(endDate);
                            }}
                            focusedInput={focusedInput}
                            onFocusChange={focusedInput =>
                              setFocusedInput(focusedInput)
                            }
                            isOutsideRange={() => false}
                            minimumNights={0}
                            showDefaultInputIcon
                            showClearDates
                            withPortal
                            hideKeyboardShortcutsPanel
                            renderCalendarInfo={() => (
                              <p className="text-center font-italic">
                                To select a single day click the date twice.
                              </p>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="reason">Reason</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter reason"
                            id="reason"
                            onChange={handleEditReason}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-end">
                      <button type="submit" className="btn btn-primary mr-3">
                        Save changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleCloseEdit}
                      >
                        Close
                      </button>
                    </div>
                    <div className="text-primary text-center">
                      {loading ? (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <p className="mt-3">{serverMessage}</p>
                      )}
                    </div>
                    <div className="text-danger text-center">
                      {errorMessage}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

interface Props {
  pending_items: Array<PendingItems>;
  public_holiday: PublicHolidayType;
  refetch: Function;
}

export default function PendingLeaveList(props: Props): JSX.Element {
  const [listID, setListID] = useState<string>('');
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeclining, setIsDeclining] = useState<boolean>(false);

  function handleOpenApproveLeave(
    e: React.MouseEvent<HTMLButtonElement>
  ): void {
    setIsApproving(!isApproving);
    setListID(e.currentTarget.id);
  }

  function handleCloseApproveLeave(): void {
    setIsApproving(!isApproving);
    setListID('');
    props.refetch();
  }

  function handleOpenDecline(e: React.MouseEvent<HTMLButtonElement>): void {
    setIsDeclining(!isDeclining);
    setListID(e.currentTarget.id);
  }

  function handleCloseDecline(): void {
    setIsDeclining(!isDeclining);
    setListID('');
    props.refetch();
  }

  function handleOpenEdit(e: React.MouseEvent<HTMLButtonElement>): void {
    setIsEditing(!isEditing);
    setListID(e.currentTarget.id);
  }

  function handleCloseEdit(): void {
    setIsEditing(!isEditing);
    setListID('');
    props.refetch();
  }

  const { pending_items, public_holiday } = props;

  if (isApproving) {
    return (
      <ApproveLeave
        pending_items={pending_items}
        listID={listID}
        handleCloseApproveLeave={handleCloseApproveLeave}
      />
    );
  }

  if (isEditing) {
    return (
      <EditLeave
        pending_items={pending_items}
        public_holiday={public_holiday}
        listID={listID}
        handleCloseEdit={handleCloseEdit}
      />
    );
  }

  if (isDeclining) {
    return (
      <DeclineLeave
        pending_items={pending_items}
        listID={listID}
        handleCloseDecline={handleCloseDecline}
      />
    );
  }

  const items = props.pending_items
    .map(a => a)
    .sort((a, b) => {
      return a.user.othernames.localeCompare(b.user.othernames);
    });

  const itemNodes = items.map(record => (
    <tr key={record.id}>
      <td>
        {record.user.othernames} {record.user.surname}
      </td>
      <td>{record.leaveName}</td>
      <td>{record.leaveType}</td>
      <td>{record.startDate}</td>
      <td>{record.endDate}</td>
      <td>{record.leaveDays}</td>
      <td>{record.leaveReason}</td>
      <td>
        <button
          className="btn btn-link"
          onClick={handleOpenApproveLeave}
          id={record.id}
        >
          Approve
        </button>
      </td>
      <td>
        <button
          className="btn btn-link text-danger"
          onClick={handleOpenDecline}
          id={record.id}
        >
          Decline
        </button>
      </td>
      <td>
        <button
          className="btn btn-link"
          onClick={handleOpenEdit}
          id={record.id}
        >
          Edit
        </button>
      </td>
    </tr>
  ));

  return itemNodes.length > 0 ? (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Leave</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Approve</th>
            <th>Decline</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>{itemNodes}</tbody>
      </table>
    </div>
  ) : (
    <div
      className="card card-body border-0"
      style={{
        paddingTop: '100px',
        paddingBottom: '260px',
        alignItems: 'center'
      }}
    >
      <img src={done_all} alt="All done" height="100" width="100" />
      <h1 className="display-4">You're all caught up.</h1>
    </div>
  );
}
