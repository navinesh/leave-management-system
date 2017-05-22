// @flow
import React, { Component } from 'react';

import { fetchApprovedLeave } from '../actions/ApprovedLeave';

import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import '../spinners.css';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export default class ApprovedLeaveList extends Component {
  props: {
    approved_items: Array<any>,
    public_holiday: Array<any>,
    dispatch: Function,
    onEditLeaveSubmit: Function,
    onDeleteLeaveSubmit: Function,
    isEditLeaveFetching: boolean,
    editLeaveMessage: string
  };

  state: {
    errorMessage: string,
    editReason: string,
    deleteReason: string,
    listID: string,
    startDate: any,
    endDate: any,
    isEditing: boolean,
    isDelete: boolean,
    focusedInput: ?boolean
  };

  handleOpenEdit: Function;
  handleEditReason: Function;
  handleEditSubmit: Function;
  handleCloseEdit: Function;
  hadleOpenDelete: Function;
  handleDeleteReason: Function;
  handleDeleteSubmit: Function;
  handleCloseDelete: Function;

  leave_name: HTMLInputElement;
  leave_type: HTMLInputElement;
  startDate: HTMLInputElement;
  endDate: HTMLInputElement;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      editReason: '',
      deleteReason: '',
      startDate: null,
      endDate: null,
      listID: '',
      isEditing: false,
      isDelete: false,
      focusedInput: null
    };

    this.handleEditReason = this.handleEditReason.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.hadleOpenDelete = this.hadleOpenDelete.bind(this);
    this.handleDeleteReason = this.handleDeleteReason.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    this.handleCloseDelete = this.handleCloseDelete.bind(this);
  }

  handleOpenEdit(e: Event & { currentTarget: HTMLElement }) {
    this.setState({
      isEditing: !this.state.isEditing,
      listID: e.currentTarget.id
    });
  }

  handleEditReason({ target }: SyntheticInputEvent) {
    this.setState({ editReason: target.value });
  }

  handleEditSubmit(e: Event) {
    e.preventDefault();
    const { approved_items, onEditLeaveSubmit } = this.props;

    const leave_id = parseInt(this.state.listID, 10);
    const startDate = this.state.startDate
      ? this.state.startDate
      : moment(this.startDate.value, 'DD/MM/YYYY');
    const endDate = this.state.endDate
      ? this.state.endDate
      : moment(this.endDate.value, 'DD/MM/YYYY');
    const leave = this.leave_name.value;
    const leaveType = this.leave_type.value;
    const reason = this.state.editReason ? this.state.editReason.trim() : null;

    const userRecord = approved_items.filter(e => e.id === leave_id);

    const previousLeaveName = userRecord[0].leave_name;
    const previousLeaveDays = userRecord[0].leave_days;
    const annualDays = userRecord[0].user.annual;
    const sickDays = userRecord[0].user.sick;
    const bereavementDays = userRecord[0].user.bereavement;
    const christmasDays = userRecord[0].user.christmas;
    const maternityDays =
      userRecord[0].user.maternity && userRecord[0].user.maternity;
    const dateOfBirth = userRecord[0].user.date_of_birth;

    if (
      !leave_id ||
      !leave ||
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason
    ) {
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

    // check if leave days need to be credited back
    const getPreviousLeaveDays = type => {
      if (
        leave !== previousLeaveName &&
        previousLeaveName !== 'birthday' &&
        previousLeaveName !== 'lwop' &&
        previousLeaveName !== 'other'
      ) {
        const totalDays = {
          annual: () => {
            return parseInt(annualDays, 10) + parseInt(previousLeaveDays, 10);
          },
          sick: () => {
            return parseInt(sickDays, 10) + parseInt(previousLeaveDays, 10);
          },
          bereavement: () => {
            return (
              parseInt(bereavementDays, 10) + parseInt(previousLeaveDays, 10)
            );
          },
          christmas: () => {
            return (
              parseInt(christmasDays, 10) + parseInt(previousLeaveDays, 10)
            );
          },
          maternity: () => {
            return (
              parseInt(maternityDays, 10) + parseInt(previousLeaveDays, 10)
            );
          }
        };
        return totalDays[type]();
      }
    };

    const newLeaveBalance = getPreviousLeaveDays(previousLeaveName);

    const sDate = moment(startDate).format('DD/MM/YYYY');
    const eDate = moment(endDate).format('DD/MM/YYYY');

    this.setState({ errorMessage: '' });

    const editLeaveData = {
      leave_id: leave_id,
      leave: leave,
      leaveType: leaveType,
      startDate: sDate,
      endDate: eDate,
      reason: reason,
      leaveDays: myLeaveDays,
      applicationDays: applicationDays,
      previousLeaveDays: previousLeaveDays,
      newLeaveBalance: newLeaveBalance,
      previousLeaveName: previousLeaveName
    };

    onEditLeaveSubmit(editLeaveData);
  }

  handleCloseEdit() {
    const { dispatch } = this.props;

    this.setState({ isEditing: !this.state.isEditing, errorMessage: '' });

    if (this.state.editReason) {
      dispatch(fetchApprovedLeave());
      dispatch({ type: 'CLEAR_EDIT_LEAVE' });
    }
  }

  hadleOpenDelete(e: Event & { currentTarget: HTMLElement }) {
    this.setState({
      isDelete: !this.state.isDelete,
      listID: e.currentTarget.id
    });
  }

  handleDeleteReason({ target }: SyntheticInputEvent) {
    this.setState({ deleteReason: target.value });
  }

  handleDeleteSubmit(e: Event) {
    e.preventDefault();
    const { onDeleteLeaveSubmit } = this.props;

    const listID = this.state.listID;
    const reason = this.state.deleteReason
      ? this.state.deleteReason.trim()
      : null;

    if (!reason) {
      this.setState({
        errorMessage: 'Reason field is mandatory!'
      });
      return;
    }

    const deleteLeaveData = {
      leaveID: listID,
      reason: reason
    };

    onDeleteLeaveSubmit(deleteLeaveData);
  }

  handleCloseDelete(e: Event) {
    const { dispatch } = this.props;

    this.setState({ isDelete: !this.state.isDelete, errorMessage: '' });

    if (this.state.deleteReason) {
      dispatch(fetchApprovedLeave());
    }
  }

  render() {
    const { approved_items } = this.props;
    const listID = parseInt(this.state.listID, 10);

    if (this.state.isEditing) {
      return (
        <div>
          {approved_items.filter(e => e.id === listID).map(record => (
            <div key={record.id}>
              <div
                className="col-md-5 offset-md-3"
                style={{ paddingTop: '40px' }}
              >
                <div className="card card-block">
                  <h5>Edit</h5>
                  <form
                    encType="multipart/form-data"
                    onSubmit={this.handleEditSubmit}
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          {record.user.othernames}{' '}{record.user.surname}
                        </p>
                      </div>
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
                            onChange={this.handleEditReason}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={this.handleCloseEdit}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary ml-4">
                      Save changes
                    </button>
                    {this.props.isEditLeaveFetching
                      ? <div className="loader1" />
                      : <p className="text-primary pt-2">
                          {this.props.editLeaveMessage}
                        </p>}

                    <div className="text-danger">
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

    if (this.state.isDelete) {
      return (
        <div>
          {approved_items.filter(e => e.id === listID).map(record => (
            <div key={record.id}>
              <div
                className="col-md-5 offset-md-3"
                style={{ paddingTop: '40px' }}
              >
                <div className="card card-block">
                  <h5>
                    Delete
                  </h5>
                  <form onSubmit={this.handleDeleteSubmit}>
                    <div className="row">
                      <div className="col">
                        <p>{record.othernames}{' '}{record.surname}</p>
                        <div className="form-group">
                          <label htmlFor="reason">Reason</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter reason"
                            onChange={this.handleDeleteReason}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={this.handleCloseDelete}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary ml-4">
                      Decline
                    </button>
                    <div className="text-danger pt-2">
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

    const items = approved_items
      .filter(record => {
        // get current date and format it
        let dateToday = moment();

        let todayDate = dateToday.format('DD/MM/YYYY');

        // get end date and format it
        let end_Date = moment(record.end_date, 'DD/MM/YYYY').format(
          'DD/MM/YYYY'
        );

        // check if current date and end date is same
        let isCurrentDate = todayDate === end_Date ? true : false;

        // check if end date is same or greater than current date
        let eDate = moment(record.end_date, 'DD/MM/YYYY').format('MM/DD/YYYY');

        let endDate = moment(new Date(eDate));

        let isEndDate = endDate.isSameOrAfter(dateToday);

        // return true for current and future leaves
        return isCurrentDate || isEndDate ? true : false;
      })
      .map(data => (
        <tr key={data.id}>
          <td>{data.user.othernames}{' '}{data.user.surname}</td>
          <td>{data.leave_name}</td>
          <td>{data.leave_type}</td>
          <td>{data.start_date}</td>
          <td>{data.end_date}</td>
          <td>{data.leave_days}</td>
          <td>
            <button
              className="btn btn-link text-primary"
              onClick={this.handleOpenEdit}
              id={data.id}
            >
              Edit
            </button>
          </td>
          <td>
            <button
              className="btn btn-link text-danger"
              onClick={this.hadleOpenDelete}
              id={data.id}
            >
              Delete
            </button>
          </td>
        </tr>
      ));

    return items.length > 0
      ? <div>
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
                  <th>Leave days</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </table>
          </div>
        </div>
      : <div className="container text-center" style={{ paddingTop: '100px' }}>
          <h1 className="display-4">There are no approved leave record.</h1>
        </div>;
  }
}
