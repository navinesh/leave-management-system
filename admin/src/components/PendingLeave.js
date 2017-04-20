// @flow
import React, { Component } from 'react';
import Modal from 'react-modal';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

import customStyles from '../Styles';
import '../spinners.css';

import { fetchPendingLeave } from '../actions/PendingLeave';

export default class PendingLeaveList extends Component {
  props: {
    pending_items: Array<any>,
    public_holiday: Array<any>,
    onApproveLeaveSubmit: Function,
    onDeclineLeaveSubmit: Function,
    onEditLeaveSubmit: Function,
    isEditLeaveFetching: boolean,
    editLeaveMessage: string,
    dispatch: Function
  };

  state: {
    errorMessage: string,
    declineReason: string,
    editReason: string,
    showModal1: boolean,
    showModal2: boolean,
    listID: string,
    startDate: any,
    endDate: any
  };

  handleOpenModal1: Function;
  handleCloseModal1: Function;
  handleOpenModal2: Function;
  handleCloseModal2: Function;
  handleApproveLeave: Function;
  handleDeclineReason: Function;
  handleDeclineSubmit: Function;
  handleEditReason: Function;
  handleEditSubmit: Function;
  handleStartDateChange: Function;
  handleEndDateChange: Function;

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
      startDate: '',
      endDate: '',
      listID: '',
      showModal1: false,
      showModal2: false
    };

    this.handleOpenModal1 = this.handleOpenModal1.bind(this);
    this.handleCloseModal1 = this.handleCloseModal1.bind(this);
    this.handleOpenModal2 = this.handleOpenModal2.bind(this);
    this.handleCloseModal2 = this.handleCloseModal2.bind(this);
    this.handleApproveLeave = this.handleApproveLeave.bind(this);
    this.handleDeclineReason = this.handleDeclineReason.bind(this);
    this.handleDeclineSubmit = this.handleDeclineSubmit.bind(this);
    this.handleEditReason = this.handleEditReason.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  handleStartDateChange(e: Event) {
    this.setState({ startDate: e });
  }

  handleEndDateChange(e: Event) {
    this.setState({ endDate: e });
  }

  handleDeclineReason({ target }: SyntheticInputEvent) {
    this.setState({ declineReason: target.value });
  }

  handleEditReason({ target }: SyntheticInputEvent) {
    this.setState({ editReason: target.value });
  }

  handleOpenModal1(e: Event & { currentTarget: HTMLElement }) {
    this.setState({ showModal1: true, listID: e.currentTarget.id });
  }

  handleOpenModal2(e: Event & { currentTarget: HTMLElement }) {
    this.setState({ showModal2: true, listID: e.currentTarget.id });
  }

  handleCloseModal1() {
    const { dispatch } = this.props;

    this.setState({ showModal1: false, errorMessage: '' });
    if (this.state.declineReason) {
      dispatch(fetchPendingLeave());
    }
  }

  handleCloseModal2() {
    const { dispatch } = this.props;

    this.setState({ showModal2: false, errorMessage: '' });
    if (this.state.editReason) {
      dispatch(fetchPendingLeave());
      dispatch({ type: 'CLEAR_EDIT_LEAVE' });
    }
  }

  handleApproveLeave(e: Event) {
    const leaveID = e.target.id ? e.target.id : null;
    const LeaveStatus = 'approved';

    if (!leaveID) {
      this.setState({
        errorMessage: 'Could not get leave id!'
      });
      return;
    }

    const approveLeaveData = {
      leaveID: leaveID,
      LeaveStatus: LeaveStatus
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

    const obj = {};
    pending_items.filter(e => e.id === leave_id).map(record => {
      obj['annual'] = record.user.annual;
      obj['sick'] = record.user.sick;
      obj['bereavement'] = record.user.bereavement;
      obj['christmas'] = record.user.christmas;
      obj['maternity'] = record.user.maternity;
      obj['date_of_birth'] = record.user.date_of_birth;
      return null;
    });

    const annualDays = obj.annual;
    const sickDays = obj.sick;
    const bereavementDays = obj.bereavement;
    const christmasDays = obj.christmas;
    const maternityDays = obj.maternity && obj.maternity;
    const dateOfBirth = obj.date_of_birth;

    if (
      !leave_id || !leave || !leaveType || !startDate || !endDate || !reason
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
      applicationDays: applicationDays
    };

    this.props.onEditLeaveSubmit(editLeaveData);
  }

  render() {
    const listID = parseInt(this.state.listID, 10);

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
            onClick={this.handleOpenModal1}
            id={record.id}
          >
            Decline
          </button>
        </td>
        <td>
          <button
            className="btn btn-link"
            onClick={this.handleOpenModal2}
            id={record.id}
          >
            Edit
          </button>
        </td>
      </tr>
    ));

    return itemNodes.length > 0
      ? <div className="row">
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
          {this.props.pending_items.filter(e => e.id === listID).map(record => (
            <div key={record.id}>
              <Modal
                className="Modal__Bootstrap modal-dialog"
                isOpen={this.state.showModal1}
                onRequestClose={this.handleCloseModal1}
                contentLabel="Modal #1"
                overlayClassName="Overlay"
                style={customStyles}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Decline
                    </h5>
                  </div>
                  <form onSubmit={this.handleDeclineSubmit}>
                    <div className="modal-body">
                      <p>{record.user.othernames}{' '}{record.user.surname}</p>
                      <div className="form-group">
                        <label htmlFor="reason">Reason</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter reason"
                          id="reason"
                          onChange={this.handleDeclineReason}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={this.handleCloseModal1}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Decline
                      </button>
                    </div>
                  </form>
                  <div className="text-danger text-center">
                    <div className="pb-4">{this.state.errorMessage}</div>
                  </div>
                </div>
              </Modal>
            </div>
          ))}
          {this.props.pending_items.filter(e => e.id === listID).map(record => (
            <div key={record.id}>
              <Modal
                className="Modal__Bootstrap modal-dialog"
                isOpen={this.state.showModal2}
                onRequestClose={this.handleCloseModal2}
                contentLabel="Modal #2"
                overlayClassName="Overlay"
                style={customStyles}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Edit
                    </h5>
                  </div>
                  <form
                    encType="multipart/form-data"
                    onSubmit={this.handleEditSubmit}
                  >
                    <div className="modal-body">
                      <div className="row">
                        <div className="col">
                          <p className="h5">
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
                              ref={select => this.leave_name = select}
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
                              ref={select => this.leave_type = select}
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
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="startDate">Start date</label>
                            <input
                              type="hidden"
                              defaultValue={record.start_date}
                              ref={input => this.startDate = input}
                            />
                            <DatePicker
                              className="form-control"
                              placeholderText="Click to select a date"
                              selected={this.state.startDate}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              onChange={this.handleStartDateChange}
                              showMonthDropdown
                              dropdownMode="select"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="endDate">End date</label>
                            <input
                              type="hidden"
                              defaultValue={record.end_date}
                              ref={input => this.endDate = input}
                            />
                            <DatePicker
                              className="form-control"
                              placeholderText="Click to select a date"
                              selected={this.state.endDate}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              onChange={this.handleEndDateChange}
                              showMonthDropdown
                              dropdownMode="select"
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
                    </div>
                    <div className="modal-footer">
                      <div className="form-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={this.handleCloseModal2}
                        >
                          Close
                        </button>
                      </div>
                      <div className="form-group">
                        <button type="submit" className="btn btn-primary col">
                          Save changes
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="text-primary text-center">
                    {this.props.isEditLeaveFetching
                      ? <div className="loader1" />
                      : <p className="lead pb-2">
                          {this.props.editLeaveMessage}
                        </p>}
                  </div>
                  <div className="text-danger text-center">
                    <div className="pb-5">{this.state.errorMessage}</div>
                  </div>
                </div>
              </Modal>
            </div>
          ))}
        </div>
      : <div className="text-center" style={{ paddingTop: '40px' }}>
          <h1 className="display-4">There are no pending leave record.</h1>
        </div>;
  }
}
