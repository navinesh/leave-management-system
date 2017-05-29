// @flow
import React, { Component } from 'react';

import { fetchPendingLeave } from '../actions/PendingLeave';

import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import '../spinners.css';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export default class PendingLeaveList extends Component {
  props: {
    pending_items: Array<any>,
    public_holiday: Array<any>,
    onApproveLeaveSubmit: Function,
    onDeclineLeaveSubmit: Function,
    onEditLeaveSubmit: Function,
    isEditLeaveFetching: boolean,
    editLeaveMessage: string,
    isDeclineLeaveFetching: boolean,
    declineLeaveMessage: string,
    dispatch: Function
  };

  state: {
    errorMessage: string,
    declineReason: string,
    editReason: string,
    listID: number,
    startDate: any,
    endDate: any,
    isEditing: boolean,
    focusedInput: ?boolean,
    isDecline: boolean
  };

  handleOpenEdit: Function;
  handleCloseEdit: Function;
  handleOpenDecline: Function;
  handleCloseDecline: Function;
  handleApproveLeave: Function;
  handleDeclineReason: Function;
  handleDeclineSubmit: Function;
  handleEditReason: Function;
  handleEditSubmit: Function;

  leave_name: HTMLInputElement;
  leave_type: HTMLInputElement;
  startDate: HTMLInputElement;
  endDate: HTMLInputElement;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      declineReason: '',
      editReason: '',
      startDate: null,
      endDate: null,
      listID: 0,
      isEditing: false,
      focusedInput: null,
      isDecline: false
    };

    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.handleOpenDecline = this.handleOpenDecline.bind(this);
    this.handleCloseDecline = this.handleCloseDecline.bind(this);
    this.handleApproveLeave = this.handleApproveLeave.bind(this);
    this.handleDeclineReason = this.handleDeclineReason.bind(this);
    this.handleDeclineSubmit = this.handleDeclineSubmit.bind(this);
    this.handleEditReason = this.handleEditReason.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }

  handleOpenEdit(e: Event & { currentTarget: HTMLElement }) {
    this.setState({
      isEditing: !this.state.isEditing,
      listID: e.currentTarget.id ? parseInt(e.currentTarget.id, 10) : 0
    });
  }

  handleCloseEdit() {
    const { dispatch } = this.props;

    this.setState({
      isEditing: !this.state.isEditing,
      errorMessage: '',
      startDate: null,
      endDate: null,
      listID: 0
    });

    if (this.state.editReason) {
      dispatch(fetchPendingLeave());
      dispatch({ type: 'CLEAR_EDIT_LEAVE' });
    }
  }

  handleDeclineReason({ target }: SyntheticInputEvent) {
    this.setState({ declineReason: target.value });
  }

  handleEditReason({ target }: SyntheticInputEvent) {
    this.setState({ editReason: target.value });
  }

  handleOpenDecline(e: Event & { currentTarget: HTMLElement }) {
    this.setState({
      isDecline: !this.state.isDecline,
      listID: e.currentTarget.id ? parseInt(e.currentTarget.id, 10) : 0
    });
  }

  handleCloseDecline() {
    const { dispatch } = this.props;

    this.setState({
      isDecline: !this.state.isDecline,
      errorMessage: '',
      listID: 0
    });

    if (this.state.declineReason) {
      dispatch(fetchPendingLeave());
      dispatch({ type: 'CLEAR_DECLINE_LEAVE' });
    }
  }

  handleApproveLeave(e: Event) {
    const { pending_items } = this.props;
    const leaveID = e.target.id ? parseInt(e.target.id, 10) : 0;
    const leaveStatus = 'approved';

    if (!leaveID) {
      this.setState({
        errorMessage: 'Could not get leave id!'
      });
      return;
    }

    const userRecord = pending_items.filter(e => e.id === leaveID);

    const userID = userRecord[0].user_id;
    const leaveDays = userRecord[0].leave_days;
    const leaveName = userRecord[0].leave_name;

    const approveLeaveData = {
      leaveID: leaveID,
      leaveStatus: leaveStatus,
      userID: userID,
      leaveDays: leaveDays,
      leaveName: leaveName
    };

    this.props.onApproveLeaveSubmit(approveLeaveData);
  }

  handleDeclineSubmit(e: Event) {
    e.preventDefault();
    const listID = this.state.listID;
    const reason = this.state.declineReason
      ? this.state.declineReason.trim()
      : null;

    if (!reason) {
      this.setState({
        errorMessage: 'Reason field is mandatory!'
      });
      return;
    }

    const declineLeaveData = {
      leaveID: listID,
      reason: reason
    };

    this.props.onDeclineLeaveSubmit(declineLeaveData);
  }

  handleEditSubmit(e: Event) {
    e.preventDefault();
    const { pending_items } = this.props;
    const listID = parseInt(this.state.listID, 10);
    const startDate = this.state.startDate
      ? this.state.startDate
      : moment(this.startDate.value, 'DD/MM/YYYY');
    const endDate = this.state.endDate
      ? this.state.endDate
      : moment(this.endDate.value, 'DD/MM/YYYY');
    const leave = this.leave_name.value;
    const leaveType = this.leave_type.value;
    const reason = this.state.editReason ? this.state.editReason.trim() : null;

    const userRecord = pending_items.filter(e => e.id === listID);

    const annualDays = userRecord[0].user.annual;
    const sickDays = userRecord[0].user.sick;
    const bereavementDays = userRecord[0].user.bereavement;
    const christmasDays = userRecord[0].user.christmas;
    const maternityDays =
      userRecord[0].user.maternity && userRecord[0].user.maternity;
    const dateOfBirth = userRecord[0].user.date_of_birth;

    const previousLeaveDays = userRecord[0].leave_days;
    const previousLeaveName = userRecord[0].leave_name;
    const previousLeaveType = userRecord[0].leave_type;
    const previousStartDate = userRecord[0].start_date;
    const previousEndDate = userRecord[0].end_date;

    if (!listID || !leave || !leaveType || !startDate || !endDate || !reason) {
      this.setState({
        errorMessage: 'Reason field is mandatory!'
      });

      return;
    }

    // get date range from user selection
    const leaveRangeDays = endDate.diff(startDate, 'days') + 1;

    // check user data range selection
    if (leaveRangeDays <= 0) {
      this.setState({ errorMessage: 'The dates you selected are invalid!' });
      return;
    }

    // create date range
    const range = moment.range(startDate, endDate);

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
    const publicHolidays = this.props.public_holiday.map(item => {
      let hDate = new Date(item.holiday_date);
      let holiday_date = moment(hDate).format('DD, MM, YYYY');
      return holiday_date;
    });

    const publicHolidaysSet = new Set(publicHolidays);
    const daysExcludingHolidaysSet = new Set(
      [...daysExcludingWeekendSet].filter(x => !publicHolidaysSet.has(x))
    );
    const leaveDays = daysExcludingHolidaysSet.size;

    if (leaveDays === 0) {
      this.setState({
        errorMessage: 'The dates you selected fall on public holiday!'
      });
      return;
    }

    // if half day then subtract 0.5
    const myLeaveDays = leaveType === 'half day am' ||
      leaveType === 'half day pm'
      ? leaveDays - 0.5
      : leaveDays;

    // calculate total leave days
    const getLeaveDays = type => {
      const totalDays = {
        annual: () => {
          return annualDays - myLeaveDays;
        },
        sick: () => {
          return sickDays - myLeaveDays;
        },
        bereavement: () => {
          return bereavementDays - myLeaveDays;
        },
        christmas: () => {
          return christmasDays - myLeaveDays;
        },
        birthday: () => {
          // create date
          const dOB = new Date(dateOfBirth);
          dOB.setHours(dOB.getHours() - 12);
          const birthDate = moment.utc(dOB);
          // check date of birth
          return moment(startDate).isSame(birthDate) &&
            moment(endDate).isSame(birthDate)
            ? myLeaveDays
            : undefined;
        },
        maternity: () => {
          return maternityDays - myLeaveDays;
        },
        lwop: () => {
          return myLeaveDays;
        },
        other: () => {
          return myLeaveDays;
        }
      };
      return totalDays[type]();
    };

    const applicationDays = getLeaveDays(leave);

    if (applicationDays < 0) {
      this.setState({ errorMessage: 'Leave balance cannot be negative!' });
      return;
    }

    if (applicationDays === undefined) {
      this.setState({
        errorMessage: 'The date you selected as date of birth does not match our record!'
      });
      return;
    }

    const sDate = moment(startDate).format('DD/MM/YYYY');
    const eDate = moment(endDate).format('DD/MM/YYYY');

    this.setState({ errorMessage: '' });

    const editLeaveData = {
      leave_id: listID,
      leave: leave,
      leaveType: leaveType,
      startDate: sDate,
      endDate: eDate,
      reason: reason,
      leaveDays: myLeaveDays,
      applicationDays: applicationDays,
      previousLeaveDays: previousLeaveDays,
      previousLeaveName: previousLeaveName,
      previousLeaveType: previousLeaveType,
      previousStartDate: previousStartDate,
      previousEndDate: previousEndDate
    };

    this.props.onEditLeaveSubmit(editLeaveData);
  }

  render() {
    if (this.state.isEditing) {
      return (
        <div>
          {this.props.pending_items
            .filter(e => e.id === this.state.listID)
            .map(record => (
              <div key={record.id}>
                <div
                  className="col-md-6 offset-md-3 pb-2"
                  style={{ paddingTop: '40px' }}
                >
                  <div className="card card-block">
                    <h5>
                      {record.user.othernames}{' '}{record.user.surname}
                    </h5>
                    <form
                      encType="multipart/form-data"
                      onSubmit={this.handleEditSubmit}
                    >
                      <div className="row">
                        <div className="col" />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="leave">
                              Leave
                            </label>
                            <select
                              className="form-control"
                              id="leave"
                              defaultValue={record.leave_name}
                              ref={select => (this.leave_name = select)}
                            >
                              <option>{record.leave_name}</option>
                              <option>annual</option>
                              <option>sick</option>
                              <option>bereavement</option>
                              <option>christmas</option>
                              <option>birthday</option>
                              {record.user.gender === 'female'
                                ? <option>maternity</option>
                                : null}
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
                              defaultValue={record.leave_type}
                              ref={select => (this.leave_type = select)}
                            >
                              <option>{record.leave_type}</option>
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
                              defaultValue={record.start_date}
                              ref={input => (this.startDate = input)}
                            />
                            <input
                              type="hidden"
                              defaultValue={record.end_date}
                              ref={input => (this.endDate = input)}
                            />
                            <DateRangePicker
                              startDatePlaceholderText={record.start_date}
                              endDatePlaceholderText={record.end_date}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              onDatesChange={({ startDate, endDate }) =>
                                this.setState({ startDate, endDate })}
                              focusedInput={this.state.focusedInput}
                              onFocusChange={focusedInput =>
                                this.setState({ focusedInput })}
                              isOutsideRange={() => false}
                              minimumNights={0}
                              showDefaultInputIcon
                              showClearDates
                              withPortal
                              renderCalendarInfo={() => (
                                <p className="text-center">
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
                              onChange={this.handleEditReason}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={this.handleCloseEdit}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm ml-4"
                      >
                        Save changes
                      </button>
                      <div className="text-primary text-center">
                        {this.props.isEditLeaveFetching
                          ? <div className="loader2" />
                          : <p className="mt-3">
                              {this.props.editLeaveMessage}
                            </p>}
                      </div>
                      <div className="text-danger text-center">
                        {this.state.errorMessage}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ))}
        </div>
      );
    }

    if (this.state.isDecline) {
      return (
        <div>
          {this.props.pending_items
            .filter(e => e.id === this.state.listID)
            .map(record => (
              <div key={record.id}>
                <div
                  className="col-md-6 offset-md-3"
                  style={{ paddingTop: '40px' }}
                >
                  <div className="card card-block">
                    <form onSubmit={this.handleDeclineSubmit}>
                      <h5>
                        {record.user.othernames}{' '}{record.user.surname}
                      </h5>
                      <div className="form-group">
                        <label htmlFor="reason">Decline reason</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter reason"
                          id="reason"
                          onChange={this.handleDeclineReason}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={this.handleCloseDecline}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm ml-4"
                      >
                        Decline
                      </button>
                      <div className="text-primary text-center">
                        {this.props.isDeclineLeaveFetching
                          ? <div className="loader2" />
                          : <p className="mt-3">
                              {this.props.declineLeaveMessage}
                            </p>}
                      </div>
                      <div className="text-danger text-center">
                        <div className="mt-3">{this.state.errorMessage}</div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ))}
        </div>
      );
    }

    const itemNodes = this.props.pending_items.map(record => (
      <tr key={record.id}>
        <td>{record.user.othernames}{' '}{record.user.surname}</td>
        <td>{record.leave_name}</td>
        <td>{record.leave_type}</td>
        <td>{record.start_date}</td>
        <td>{record.end_date}</td>
        <td>{record.leave_days}</td>
        <td>{record.leave_reason}</td>
        <td>
          <button
            className="btn btn-link"
            onClick={this.handleApproveLeave}
            id={record.id}
          >
            Approve
          </button>
        </td>
        <td>
          <button
            className="btn btn-link text-danger"
            onClick={this.handleOpenDecline}
            id={record.id}
          >
            Decline
          </button>
        </td>
        <td>
          <button
            className="btn btn-link"
            onClick={this.handleOpenEdit}
            id={record.id}
          >
            Edit
          </button>
        </td>
      </tr>
    ));

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
                <th>Leave days</th>
                <th>Reason</th>
                <th>Approve</th>
                <th>Decline</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {itemNodes}
            </tbody>
          </table>
        </div>
      : <div className="text-center" style={{ paddingTop: '40px' }}>
          <h1 className="display-4">There are no pending leave record.</h1>
        </div>;
  }
}
