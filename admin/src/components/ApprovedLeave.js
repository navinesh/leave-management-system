// @flow
import React, { useState, useRef } from 'react';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

function Search(props) {
  return (
    <div className="col-md-3">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={props.searchTerm}
          onChange={props.handleSearchChange}
        />
      </div>
    </div>
  );
}

function ClearSearch(props) {
  return (
    <div className="col-md-3">
      <button className="btn btn-link" onClick={props.handleClearSearch}>
        Clear
      </button>
    </div>
  );
}

type Props = {
  approved_items: Object,
  public_holiday: Object,
  refetch: Function,
  dispatch: Function,
  onEditApprovedLeaveSubmit: Function,
  onCancelLeaveSubmit: Function,
  isEditLeaveFetching: boolean,
  editLeaveMessage: string,
  isCancelLeaveFetching: boolean,
  cancelLeaveMessage: string
};

// type State = {
//   errorMessage: string,
//   editReason: string,
//   cancelReason: string,
//   listID: string,
//   startDate: any,
//   endDate: any,
//   isEditing: boolean,
//   isCancel: boolean,
//   focusedInput: ?boolean,
//   searchTerm: string
// };

export default function ApprovedLeaveList(props: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [listID, setListID] = useState('');
  const [editReason, setEditReason] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancel, setIsCancel] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dbStartDate = useRef(null);
  const dbEndDate = useRef(null);
  const dbLeaveName = useRef(null);
  const dbLeaveType = useRef(null);

  function handleSearchChange({ target }: SyntheticInputEvent<>) {
    setSearchTerm(target.value);
  }

  function handleClearSearch() {
    setSearchTerm('');
  }

  function handleOpenEdit(e: SyntheticEvent<HTMLElement>) {
    setIsEditing(!isEditing);
    setListID(e.currentTarget.id);
  }

  function handleEditReason({ target }: SyntheticInputEvent<>) {
    setEditReason(target.value);
  }

  function handleEditSubmit(e: Event) {
    e.preventDefault();
    const { approved_items, public_holiday, onEditApprovedLeaveSubmit } = props;

    const leave = dbLeaveName.current.value;
    const leaveType = dbLeaveType.current.value;
    const userStartDate = startDate
      ? startDate
      : moment(dbStartDate.current.value, 'DD/MM/YYYY');
    const userEndDate = endDate
      ? endDate
      : moment(dbEndDate.current.value, 'DD/MM/YYYY');
    const reason = editReason ? editReason.trim() : null;

    const userRecord = approved_items.filter(e => e.id === listID);

    const leaveID = userRecord[0].dbId;
    const previousLeaveName = userRecord[0].leaveName;
    const previousLeaveDays = userRecord[0].leaveDays;
    const previousLeaveType = userRecord[0].leaveType;
    const previousStartDate = userRecord[0].startDate;
    const previousEndDate = userRecord[0].endDate;

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

    if (
      !listID ||
      !leave ||
      !leaveType ||
      !userStartDate ||
      !userEndDate ||
      !reason
    ) {
      setErrorMessage('Reason field is mandatory!');
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

    const dateRange = [];
    for (let numDays of range.by('days')) {
      dateRange.push(numDays.format('DD, MM, YYYY'));
    }

    const weekend = [];
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

    // calculate total leave days
    function getLeaveDays(type) {
      const totalDays = {
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
          const dOB = new Date(dateOfBirth);
          dOB.setHours(dOB.getHours() - 12);
          const birthDate = moment.utc(dOB);
          // check date of birth
          return moment(userStartDate).isSame(birthDate) &&
            moment(userEndDate).isSame(birthDate)
            ? myLeaveDays
            : undefined;
        },
        maternity: function() {
          return maternityDays - myLeaveDays;
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

    // check if leave days need to be credited back
    function getPreviousLeaveDays(type) {
      if (
        leave !== previousLeaveName &&
        previousLeaveName !== 'birthday' &&
        previousLeaveName !== 'lwop' &&
        previousLeaveName !== 'other'
      ) {
        const totalDays = {
          annual: function() {
            return annualDays + previousLeaveDays;
          },
          sick: function() {
            return sickDays + previousLeaveDays;
          },
          bereavement: function() {
            return bereavementDays + previousLeaveDays;
          },
          'family care': function() {
            return familyCareDays + previousLeaveDays;
          },
          christmas: function() {
            return christmasDays + previousLeaveDays;
          },
          maternity: function() {
            return maternityDays + previousLeaveDays;
          },
          paternity: function() {
            return paternityDays + previousLeaveDays;
          }
        };
        return totalDays[type]();
      }
    }

    const newLeaveBalance = getPreviousLeaveDays(previousLeaveName);
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
      newLeaveBalance: newLeaveBalance,
      adminUser: adminUser
    };

    onEditApprovedLeaveSubmit(editLeaveData);
  }

  function handleCloseEdit() {
    const { dispatch, refetch } = props;

    setIsEditing(!isEditing);
    setErrorMessage('');
    setListID('');

    if (editReason) {
      dispatch({ type: 'CLEAR_EDIT_LEAVE' });
      refetch();
    }
  }

  function handleOpenCancel(e: SyntheticEvent<HTMLElement>) {
    setIsCancel(!isCancel);
    setListID(e.currentTarget.id);
  }

  function handleCancelReason({ target }: SyntheticInputEvent<>) {
    setCancelReason(target.value);
  }

  function handleCancelSubmit(e: Event) {
    e.preventDefault();
    const { onCancelLeaveSubmit, approved_items } = props;

    if (!cancelReason) {
      setErrorMessage('Reason field is mandatory!');
      return;
    }

    const userRecord = approved_items.filter(e => e.id === listID);

    const userID = userRecord[0].userId;
    const leaveID = userRecord[0].dbId;
    const leaveDays = userRecord[0].leaveDays;
    const leaveName = userRecord[0].leaveName;

    const leaveStatus = 'cancelled';
    const adminUser = localStorage.getItem('admin_user');

    const cancelLeaveData = {
      leaveID: leaveID,
      reason: cancelReason,
      userID: userID,
      leaveDays: leaveDays,
      leaveName: leaveName,
      leaveStatus: leaveStatus,
      adminUser: adminUser
    };

    onCancelLeaveSubmit(cancelLeaveData);
  }

  function handleCloseCancel(e: Event) {
    const { dispatch, refetch } = props;

    setIsCancel(!isCancel);
    setErrorMessage('');
    setListID('');

    if (cancelReason) {
      dispatch({ type: 'CLEAR_CANCEL_LEAVE' });
      refetch();
    }
  }

  const { approved_items } = props;

  if (isEditing) {
    return (
      <>
        {approved_items.filter(e => e.id === listID).map(record => (
          <div key={record.id}>
            <div
              className="col-md-6 ml-auto mr-auto"
              style={{ paddingTop: '10px' }}
            >
              <div className="card">
                <h5 className="card-header">Edit</h5>
                <div className="card-body">
                  <form
                    encType="multipart/form-data"
                    onSubmit={handleEditSubmit}
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          {record.user.othernames} {record.user.surname}
                        </p>
                      </div>
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
                            {record.user.gender === 'female' &&
                            record.user.maternity > 0 ? (
                              <option>maternity</option>
                            ) : null}
                            {record.user.gender === 'male' &&
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
                      {props.isEditLeaveFetching ? (
                        <div className="loader2" />
                      ) : (
                        <p className="text-primary mt-2">
                          {props.editLeaveMessage}
                        </p>
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

  if (isCancel) {
    return (
      <>
        {approved_items.filter(e => e.id === listID).map(record => (
          <div key={record.id}>
            <div
              className="col-md-6 ml-auto mr-auto"
              style={{ paddingTop: '10px' }}
            >
              <div className="card">
                <h5 className="card-header">Cancel</h5>
                <div className="card-body">
                  <form onSubmit={handleCancelSubmit}>
                    <div className="row">
                      <div className="col">
                        <p>
                          {record.user.othernames} {record.user.surname}
                        </p>
                        <div className="form-group">
                          <label htmlFor="reason">Reason</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter reason"
                            onChange={handleCancelReason}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-end">
                      <button type="submit" className="btn btn-primary mr-3">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleCloseCancel}
                      >
                        Close
                      </button>
                    </div>
                    <div className="text-primary text-center">
                      {props.isCancelLeaveFetching ? (
                        <div className="loader2" />
                      ) : (
                        <p className="mt-3">{props.cancelLeaveMessage}</p>
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

  const items = approved_items
    .filter(
      e =>
        e.user.othernames.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.user.surname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return a.user.othernames.localeCompare(b.user.othernames);
    })
    .map(data => (
      <tr key={data.id}>
        <td>
          {data.user.othernames} {data.user.surname}
        </td>
        <td>{data.leaveName}</td>
        <td>{data.leaveType}</td>
        <td>{data.startDate}</td>
        <td>{data.endDate}</td>
        <td>{data.leaveDays}</td>
        <td>
          <button
            className="btn btn-link text-primary"
            onClick={handleOpenEdit}
            id={data.id}
          >
            Edit
          </button>
        </td>
        <td>
          <button
            className="btn btn-link text-danger"
            onClick={handleOpenCancel}
            id={data.id}
          >
            Cancel
          </button>
        </td>
      </tr>
    ));

  return (
    <>
      <div className="row">
        <Search
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
        />
        {searchTerm && <ClearSearch handleClearSearch={handleClearSearch} />}
      </div>
      {items.length > 0 ? (
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
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{items}</tbody>
          </table>
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
      )}
    </>
  );
}
