// @flow
import React, { Component } from 'react';

import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

type Props = {
  approved_items: Array<any>,
  public_holiday: Array<any>,
  dispatch: Function,
  onEditApprovedLeaveSubmit: Function,
  onCancelLeaveSubmit: Function,
  isEditLeaveFetching: boolean,
  editLeaveMessage: string,
  isCancelLeaveFetching: boolean,
  cancelLeaveMessage: string,
  fetchApprovedLeave: Function
};

type State = {
  errorMessage: string,
  editReason: string,
  cancelReason: string,
  listID: number,
  startDate: any,
  endDate: any,
  isEditing: boolean,
  isCancel: boolean,
  focusedInput: ?boolean
};

export default class ApprovedLeaveList extends Component<Props, State> {
  handleOpenEdit: Function;
  handleEditReason: Function;
  handleEditSubmit: Function;
  handleCloseEdit: Function;
  handleOpenCancel: Function;
  handleCancelReason: Function;
  handleCancelSubmit: Function;
  handleCloseCancel: Function;

  leave_name: any;
  leave_type: any;
  startDate: any;
  endDate: any;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      editReason: '',
      cancelReason: '',
      startDate: null,
      endDate: null,
      listID: 0,
      isEditing: false,
      isCancel: false,
      focusedInput: null
    };

    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleEditReason = this.handleEditReason.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.handleOpenCancel = this.handleOpenCancel.bind(this);
    this.handleCancelReason = this.handleCancelReason.bind(this);
    this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
    this.handleCloseCancel = this.handleCloseCancel.bind(this);
  }

  handleOpenEdit(e: SyntheticEvent<HTMLElement>) {
    this.setState({
      isEditing: !this.state.isEditing,
      listID: parseInt(e.currentTarget.id, 10)
    });
  }

  handleEditReason({ target }: SyntheticInputEvent<>) {
    this.setState({ editReason: target.value });
  }

  handleEditSubmit(e: Event) {
    e.preventDefault();
    const { approved_items, onEditApprovedLeaveSubmit } = this.props;

    const leave_id = this.state.listID;
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
    const previousLeaveType = userRecord[0].leave_type;
    const previousStartDate = userRecord[0].start_date;
    const previousEndDate = userRecord[0].end_date;

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
    const myLeaveDays =
      leaveType === 'half day am' || leaveType === 'half day pm'
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
        errorMessage:
          'The date you selected as date of birth does not match our record!'
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
            return annualDays + previousLeaveDays;
          },
          sick: () => {
            return sickDays + previousLeaveDays;
          },
          bereavement: () => {
            return bereavementDays + previousLeaveDays;
          },
          christmas: () => {
            return christmasDays + previousLeaveDays;
          },
          maternity: () => {
            return maternityDays + previousLeaveDays;
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
      previousLeaveDays: previousLeaveDays,
      previousLeaveName: previousLeaveName,
      previousLeaveType: previousLeaveType,
      previousStartDate: previousStartDate,
      previousEndDate: previousEndDate,
      newLeaveBalance: newLeaveBalance
    };

    onEditApprovedLeaveSubmit(editLeaveData);
  }

  handleCloseEdit() {
    this.setState({
      isEditing: !this.state.isEditing,
      errorMessage: '',
      listID: 0
    });

    if (this.state.editReason) {
      this.props.dispatch(this.props.fetchApprovedLeave());
      this.props.dispatch({ type: 'CLEAR_EDIT_LEAVE' });
    }
  }

  handleOpenCancel(e: SyntheticEvent<HTMLElement>) {
    this.setState({
      isCancel: !this.state.isCancel,
      listID: parseInt(e.currentTarget.id, 10)
    });
  }

  handleCancelReason({ target }: SyntheticInputEvent<>) {
    this.setState({ cancelReason: target.value });
  }

  handleCancelSubmit(e: Event) {
    e.preventDefault();
    const { onCancelLeaveSubmit, approved_items } = this.props;

    const listID = this.state.listID;
    const reason = this.state.cancelReason
      ? this.state.cancelReason.trim()
      : null;

    if (!reason) {
      this.setState({
        errorMessage: 'Reason field is mandatory!'
      });
      return;
    }

    const userRecord = approved_items.filter(e => e.id === listID);

    const userID = userRecord[0].user.id;
    const leaveDays = userRecord[0].leave_days;
    const leaveName = userRecord[0].leave_name;

    const leaveStatus = 'cancelled';

    const cancelLeaveData = {
      leaveID: listID,
      reason: reason,
      userID: userID,
      leaveDays: leaveDays,
      leaveName: leaveName,
      leaveStatus: leaveStatus
    };

    onCancelLeaveSubmit(cancelLeaveData);
  }

  handleCloseCancel(e: Event) {
    this.setState({
      isCancel: !this.state.isCancel,
      errorMessage: '',
      listID: 0
    });

    if (this.state.cancelReason) {
      this.props.dispatch(this.props.fetchApprovedLeave());
      this.props.dispatch({ type: 'CLEAR_CANCEL_LEAVE' });
    }
  }

  render() {
    const { approved_items } = this.props;
    const listID = this.state.listID;

    if (this.state.isEditing) {
      return (
        <div>
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
                      onSubmit={this.handleEditSubmit}
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
                              defaultValue={record.leave_name}
                              ref={select => (this.leave_name = select)}
                            >
                              <option>{record.leave_name}</option>
                              <option>annual</option>
                              <option>sick</option>
                              <option>bereavement</option>
                              <option>christmas</option>
                              <option>birthday</option>
                              {record.user.gender === 'female' ? (
                                <option>maternity</option>
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
                      <div className="row justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={this.handleCloseEdit}
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary ml-2 mr-3"
                        >
                          Save changes
                        </button>
                      </div>
                      <div className="text-primary text-center">
                        {this.props.isEditLeaveFetching ? (
                          <div className="loader2" />
                        ) : (
                          <p className="text-primary mt-2">
                            {this.props.editLeaveMessage}
                          </p>
                        )}
                      </div>
                      <div className="text-danger text-center">
                        {this.state.errorMessage}
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

    if (this.state.isCancel) {
      return (
        <div>
          {approved_items.filter(e => e.id === listID).map(record => (
            <div key={record.id}>
              <div
                className="col-md-6 ml-auto mr-auto"
                style={{ paddingTop: '10px' }}
              >
                <div className="card">
                  <h5 className="card-header">Cancel</h5>
                  <div className="card-body">
                    <form onSubmit={this.handleCancelSubmit}>
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
                              onChange={this.handleCancelReason}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={this.handleCloseCancel}
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary ml-2 mr-3"
                        >
                          Submit
                        </button>
                      </div>
                      <div className="text-primary text-center">
                        {this.props.isCanceLeaveFetching ? (
                          <div className="loader2" />
                        ) : (
                          <p className="mt-3">
                            {this.props.cancelLeaveMessage}
                          </p>
                        )}
                      </div>
                      <div className="text-danger text-center">
                        {this.state.errorMessage}
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
          <td>
            {data.user.othernames} {data.user.surname}
          </td>
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
              onClick={this.handleOpenCancel}
              id={data.id}
            >
              Cancel
            </button>
          </td>
        </tr>
      ));

    return items.length > 0 ? (
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
    );
  }
}
