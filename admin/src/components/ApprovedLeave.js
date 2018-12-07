// @flow
import React, { useState, useRef } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import axios from 'axios';

import NoData from '../img/undraw_no_data_qbuo.svg';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const ARCHIVED_RECORD = gql`
  mutation archiveLeaveRecord($id: String!) {
    archiveLeaverecord(id: $id) {
      ok
    }
  }
`;

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

function EditLeave(props) {
  const [editReason, setEditReason] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const dbStartDate = useRef(null);
  const dbEndDate = useRef(null);
  const dbLeaveName = useRef(null);
  const dbLeaveType = useRef(null);
  const [serverMessage, setServerMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleEditReason({ target }: SyntheticInputEvent<>) {
    setEditReason(target.value);
  }

  function handleEditSubmit(e: Event) {
    e.preventDefault();
    const { approved_items, public_holiday } = props;

    const leave = dbLeaveName.current.value;
    const leaveType = dbLeaveType.current.value;
    const userStartDate = startDate
      ? startDate
      : moment(dbStartDate.current.value, 'DD/MM/YYYY');
    const userEndDate = endDate
      ? endDate
      : moment(dbEndDate.current.value, 'DD/MM/YYYY');
    const reason = editReason ? editReason.trim() : null;

    const userRecord = approved_items.filter(e => e.id === props.listID);

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
      !props.listID ||
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

    editApprovedLeave(editLeaveData);
  }

  async function editApprovedLeave(editLeaveData: Object) {
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/editapprovedleave',
        {
          leave_id: editLeaveData.leave_id,
          leave: editLeaveData.leave,
          leaveType: editLeaveData.leaveType,
          startDate: editLeaveData.startDate,
          endDate: editLeaveData.endDate,
          reason: editLeaveData.reason,
          leaveDays: editLeaveData.leaveDays,
          applicationDays: editLeaveData.applicationDays,
          previousLeaveDays: editLeaveData.previousLeaveDays,
          previousLeaveName: editLeaveData.previousLeaveName,
          previousLeaveType: editLeaveData.previousLeaveType,
          previousStartDate: editLeaveData.previousStartDate,
          previousEndDate: editLeaveData.previousEndDate,
          newLeaveBalance: editLeaveData.newLeaveBalance,
          admin_user: editLeaveData.adminUser
        }
      );

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data);
      } else {
        setServerMessage(response.data.message);
        setEditReason('');
        props.refetch();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  const { approved_items, listID, handleCloseEdit } = props;

  return (
    <>
      {approved_items
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
                      {loading ? (
                        <div className="loader2" />
                      ) : (
                        <p className="text-primary mt-2">{serverMessage}</p>
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

function CancelLeave(props) {
  const [serverMessage, setServerMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  function handleCancelReason({ target }: SyntheticInputEvent<>) {
    setCancelReason(target.value);
  }

  function handleCancelSubmit(e: Event) {
    e.preventDefault();

    if (!cancelReason) {
      setErrorMessage('Reason field is mandatory!');
      return;
    }

    const userRecord = props.approved_items.filter(e => e.id === props.listID);

    const userID = userRecord[0].userId;
    const leaveID = userRecord[0].dbId;
    const leaveDays = userRecord[0].leaveDays;
    const leaveName = userRecord[0].leaveName;

    const leaveStatus = 'cancelled';
    const adminUser = localStorage.getItem('admin_user');

    setErrorMessage('');

    const cancelLeaveData = {
      leaveID: leaveID,
      reason: cancelReason,
      userID: userID,
      leaveDays: leaveDays,
      leaveName: leaveName,
      leaveStatus: leaveStatus,
      adminUser: adminUser
    };

    cancelLeave(cancelLeaveData);
  }

  async function cancelLeave(cancelLeaveData: Object) {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/cancelleave', {
        leaveID: cancelLeaveData.leaveID,
        cancelReason: cancelLeaveData.reason,
        userID: cancelLeaveData.userID,
        leaveDays: cancelLeaveData.leaveDays,
        leaveName: cancelLeaveData.leaveName,
        leaveStatus: cancelLeaveData.leaveStatus,
        admin_user: cancelLeaveData.adminUser
      });

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data.message);
      } else {
        setServerMessage(response.data.message);
        setCancelReason('');
        props.refetch();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  const { approved_items, listID, handleCloseCancel } = props;

  return (
    <>
      {approved_items
        .filter(e => e.id === listID)
        .map(record => (
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
                      {loading ? (
                        <div className="loader" />
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

type archivedRecordProps = {
  id: string,
  APPROVED_RECORD: string
};

function ArchiveLeaveRecord(props: archivedRecordProps) {
  return (
    <Mutation
      mutation={ARCHIVED_RECORD}
      variables={{ id: props.id }}
      refetchQueries={[{ query: props.APPROVED_RECORD }]}
    >
      {(archiveLeaverecord, { loading, error }) => {
        if (loading) {
          return (
            <span className="ml-2 font-italic text-primary">Loading...</span>
          );
        }

        if (error) {
          console.log(error);
          return (
            <span className="ml-2 font-italic text-warning">Error...</span>
          );
        }

        return (
          <button
            className="btn btn-link btn-sm text-danger"
            onClick={archiveLeaverecord}
          >
            Archive
          </button>
        );
      }}
    </Mutation>
  );
}

type Props = {
  approved_items: Object,
  public_holiday: Object,
  refetch: Function,
  APPROVED_RECORD: string
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
  const [listID, setListID] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

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

  function handleCloseEdit() {
    setIsEditing(!isEditing);
    setListID('');
  }

  function handleOpenCancel(e: SyntheticEvent<HTMLElement>) {
    setIsCancel(!isCancel);
    setListID(e.currentTarget.id);
  }

  function handleCloseCancel(e: Event) {
    setIsCancel(!isCancel);
    setListID('');
  }

  const { approved_items, refetch, APPROVED_RECORD } = props;

  if (isEditing) {
    return (
      <EditLeave
        approved_items={approved_items}
        listID={listID}
        handleCloseEdit={handleCloseEdit}
        refetch={refetch}
      />
    );
  }

  if (isCancel) {
    return (
      <CancelLeave
        approved_items={approved_items}
        listID={listID}
        handleCloseCancel={handleCloseCancel}
        refetch={refetch}
      />
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
        <td>
          <ArchiveLeaveRecord id={data.id} APPROVED_RECORD={APPROVED_RECORD} />
        </td>
      </tr>
    ));

  return (
    <>
      {approved_items.length > 0 ? (
        <>
          <div className="row">
            <Search
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
            />
            {searchTerm && (
              <ClearSearch handleClearSearch={handleClearSearch} />
            )}
          </div>
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
                  <th>Archive</th>
                </tr>
              </thead>
              <tbody>{items}</tbody>
            </table>
          </div>
        </>
      ) : (
        <div align="center">
          <img src={NoData} alt="No data" />
        </div>
      )}
    </>
  );
}
