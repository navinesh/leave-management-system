// @flow
import React, { Component } from 'react';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';

import done_all from '../img/done_all.png';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

type approveProps = {
  pending_items: Object,
  listID: string,
  onApproveLeaveSubmit: Function,
  isApproveLeaveFetching: boolean,
  approveLeavemessage: string,
  handleCloseApproveLeave: Function
};

type approveState = {
  errorMessage: string
};

class ApproveLeave extends Component<approveProps, approveState> {
  handleApproveLeaveSubmit: Function;

  constructor() {
    super();
    this.state = {
      errorMessage: ''
    };

    this.handleApproveLeaveSubmit = this.handleApproveLeaveSubmit.bind(this);
  }

  handleApproveLeaveSubmit(e: Event) {
    e.preventDefault();
    const { pending_items, listID, onApproveLeaveSubmit } = this.props;

    const leaveStatus = 'approved';

    if (!listID) {
      this.setState({
        errorMessage: 'Could not get id!'
      });
      return;
    }

    const userRecord = pending_items.filter(e => e.id === listID);

    const leaveID = userRecord[0].dbId;
    const leaveDays = userRecord[0].leaveDays;
    const leaveName = userRecord[0].leaveName;

    const approveLeaveData = {
      leaveID: leaveID,
      leaveStatus: leaveStatus,
      leaveDays: leaveDays,
      leaveName: leaveName
    };

    onApproveLeaveSubmit(approveLeaveData);
  }

  render() {
    const {
      pending_items,
      listID,
      handleCloseApproveLeave,
      isApproveLeaveFetching,
      approveLeavemessage
    } = this.props;
    return (
      <div className="col-md-10 ml-auto mr-auto">
        {pending_items.filter(e => e.id === listID).map(record => (
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
                        <div className="form-control text-muted">
                          <em>{record.leaveReason}</em>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={this.handleApproveLeaveSubmit}>
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
                      {isApproveLeaveFetching ? (
                        <div className="loader2" />
                      ) : (
                        <p className="mt-3">{approveLeavemessage}</p>
                      )}
                    </div>
                    <div className="text-danger text-center">
                      <div className="mt-3">{this.state.errorMessage}</div>
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
}

type declineProps = {
  pending_items: Object,
  listID: string,
  onDeclineLeaveSubmit: Function,
  declineLeaveMessage: string,
  isDeclineLeaveFetching: boolean,
  handleCloseDecline: Function
};

type declineState = {
  declineReason: string,
  errorMessage: string
};

class DeclineLeave extends Component<declineProps, declineState> {
  handleDeclineReason: Function;
  handleDeclineSubmit: Function;

  constructor() {
    super();
    this.state = { declineReason: '', errorMessage: '' };

    this.handleDeclineReason = this.handleDeclineReason.bind(this);
    this.handleDeclineSubmit = this.handleDeclineSubmit.bind(this);
  }

  handleDeclineReason({ target }: SyntheticInputEvent<>) {
    this.setState({ declineReason: target.value });
  }

  handleDeclineSubmit(e: Event) {
    e.preventDefault();
    const { pending_items, listID, onDeclineLeaveSubmit } = this.props;

    const reason = this.state.declineReason
      ? this.state.declineReason.trim()
      : null;

    if (!reason) {
      this.setState({
        errorMessage: 'Reason field is mandatory!'
      });
      return;
    }
    const userRecord = pending_items.filter(e => e.id === listID);
    const leaveID = userRecord[0].dbId;

    const declineLeaveData = {
      leaveID: leaveID,
      LeaveStatus: 'declined',
      DeclineReason: reason
    };

    onDeclineLeaveSubmit(declineLeaveData);
  }

  render() {
    const {
      pending_items,
      listID,
      declineLeaveMessage,
      isDeclineLeaveFetching,
      handleCloseDecline
    } = this.props;
    return (
      <div>
        {pending_items.filter(e => e.id === listID).map(record => (
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
                  <form onSubmit={this.handleDeclineSubmit}>
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
                      {isDeclineLeaveFetching ? (
                        <div className="loader2" />
                      ) : (
                        <p className="mt-3">{declineLeaveMessage}</p>
                      )}
                    </div>
                    <div className="text-danger text-center">
                      <div className="mt-3">{this.state.errorMessage}</div>
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
}

type editProps = {
  pending_items: Object,
  public_holiday: Object,
  listID: string,
  onEditLeaveSubmit: Function,
  isEditLeaveFetching: boolean,
  editLeaveMessage: string,
  handleCloseEdit: Function
};

type editState = {
  startDate: any,
  endDate: any,
  editReason: string,
  focusedInput: ?boolean,
  errorMessage: string
};

class EditLeave extends Component<editProps, editState> {
  handleEditReason: Function;
  handleEditSubmit: Function;

  leaveName: any;
  leaveType: any;
  startDate: any;
  endDate: any;

  constructor() {
    super();
    this.state = {
      startDate: null,
      endDate: null,
      editReason: '',
      focusedInput: null,
      errorMessage: ''
    };

    this.handleEditReason = this.handleEditReason.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }

  handleEditReason({ target }: SyntheticInputEvent<>) {
    this.setState({ editReason: target.value });
  }

  handleEditSubmit(e: Event) {
    e.preventDefault();
    const {
      pending_items,
      public_holiday,
      listID,
      onEditLeaveSubmit
    } = this.props;

    const startDate = this.state.startDate
      ? this.state.startDate
      : moment(this.startDate.value, 'DD/MM/YYYY');
    const endDate = this.state.endDate
      ? this.state.endDate
      : moment(this.endDate.value, 'DD/MM/YYYY');
    const leave = this.leaveName.value;
    const leaveType = this.leaveType.value;
    const reason = this.state.editReason ? this.state.editReason.trim() : null;

    const userRecord = pending_items.filter(e => e.id === listID);

    const annualDays = userRecord[0].user.annual;
    const sickDays = userRecord[0].user.sick;
    const bereavementDays = userRecord[0].user.bereavement;
    const christmasDays = userRecord[0].user.christmas;
    const maternityDays =
      userRecord[0].user.maternity && userRecord[0].user.maternity;
    const dateOfBirth = userRecord[0].user.date_of_birth;

    const leaveID = userRecord[0].dbId;
    const previousLeaveDays = userRecord[0].leaveDays;
    const previousLeaveName = userRecord[0].leaveName;
    const previousLeaveType = userRecord[0].leaveType;
    const previousStartDate = userRecord[0].startDate;
    const previousEndDate = userRecord[0].endDate;

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
      this.setState({
        errorMessage:
          'The dates you selected either fall on public holiday, Saturday or Sunday!'
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

    const sDate = moment(startDate).format('DD/MM/YYYY');
    const eDate = moment(endDate).format('DD/MM/YYYY');

    this.setState({ errorMessage: '' });

    const editLeaveData = {
      leave_id: leaveID,
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

    onEditLeaveSubmit(editLeaveData);
  }

  render() {
    const {
      pending_items,
      listID,
      handleCloseEdit,
      isEditLeaveFetching,
      editLeaveMessage
    } = this.props;
    return (
      <div>
        {pending_items.filter(e => e.id === listID).map(record => (
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
                    onSubmit={this.handleEditSubmit}
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
                            ref={select => (this.leaveName = select)}
                          >
                            <option>{record.leaveName}</option>
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
                            defaultValue={record.leaveType}
                            ref={select => (this.leaveType = select)}
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
                            ref={input => (this.startDate = input)}
                          />
                          <input
                            type="hidden"
                            defaultValue={record.endDate}
                            ref={input => (this.endDate = input)}
                          />
                          <DateRangePicker
                            startDatePlaceholderText={record.startDate}
                            endDatePlaceholderText={record.endDate}
                            startDateId="start_date_id"
                            endDateId="end_date_id"
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onDatesChange={({ startDate, endDate }) =>
                              this.setState({ startDate, endDate })
                            }
                            focusedInput={this.state.focusedInput}
                            onFocusChange={focusedInput =>
                              this.setState({ focusedInput })
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
                            onChange={this.handleEditReason}
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
                      {isEditLeaveFetching ? (
                        <div className="loader2" />
                      ) : (
                        <p className="mt-3">{editLeaveMessage}</p>
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
}

type Props = {
  pending_items: Object,
  public_holiday: Object,
  refetch: Function,
  onApproveLeaveSubmit: Function,
  onDeclineLeaveSubmit: Function,
  onEditLeaveSubmit: Function,
  isApproveLeaveFetching: boolean,
  approveLeavemessage: string,
  isEditLeaveFetching: boolean,
  editLeaveMessage: string,
  isDeclineLeaveFetching: boolean,
  declineLeaveMessage: string,
  dispatch: Function
};

type State = {
  listID: string,
  isApproving: boolean,
  isEditing: boolean,
  isDeclining: boolean
};

export default class PendingLeaveList extends Component<Props, State> {
  handleOpenEdit: Function;
  handleCloseEdit: Function;
  handleOpenDecline: Function;
  handleCloseDecline: Function;
  handleOpenApproveLeave: Function;
  handleCloseApproveLeave: Function;

  constructor() {
    super();
    this.state = {
      listID: '',
      isApproving: false,
      isEditing: false,
      isDeclining: false
    };

    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.handleOpenDecline = this.handleOpenDecline.bind(this);
    this.handleCloseDecline = this.handleCloseDecline.bind(this);
    this.handleOpenApproveLeave = this.handleOpenApproveLeave.bind(this);
    this.handleCloseApproveLeave = this.handleCloseApproveLeave.bind(this);
  }

  handleOpenApproveLeave(e: SyntheticEvent<HTMLElement>) {
    this.setState({
      isApproving: !this.state.isApproving,
      listID: e.currentTarget.id
    });
  }

  handleCloseApproveLeave() {
    const { approveLeavemessage, dispatch, refetch } = this.props;

    this.setState({
      isApproving: !this.state.isApproving,
      listID: ''
    });

    if (approveLeavemessage) {
      dispatch({ type: 'CLEAR_APPROVE_LEAVE' });
      refetch();
    }
  }

  handleOpenDecline(e: SyntheticEvent<HTMLElement>) {
    this.setState({
      isDeclining: !this.state.isDeclining,
      listID: e.currentTarget.id
    });
  }

  handleCloseDecline() {
    const { declineLeaveMessage, dispatch, refetch } = this.props;

    this.setState({
      isDeclining: !this.state.isDeclining,
      listID: ''
    });

    if (declineLeaveMessage) {
      dispatch({ type: 'CLEAR_DECLINE_LEAVE' });
      refetch();
    }
  }

  handleOpenEdit(e: SyntheticEvent<HTMLElement>) {
    this.setState({
      isEditing: !this.state.isEditing,
      listID: e.currentTarget.id
    });
  }

  handleCloseEdit() {
    const { editLeaveMessage, dispatch, refetch } = this.props;

    this.setState({
      isEditing: !this.state.isEditing,
      listID: ''
    });

    if (editLeaveMessage) {
      dispatch({ type: 'CLEAR_EDIT_LEAVE' });
      refetch();
    }
  }

  render() {
    const {
      pending_items,
      public_holiday,
      onApproveLeaveSubmit,
      isApproveLeaveFetching,
      approveLeavemessage,
      onEditLeaveSubmit,
      isEditLeaveFetching,
      editLeaveMessage,
      onDeclineLeaveSubmit,
      declineLeaveMessage,
      isDeclineLeaveFetching
    } = this.props;

    if (this.state.isApproving) {
      return (
        <ApproveLeave
          pending_items={pending_items}
          listID={this.state.listID}
          onApproveLeaveSubmit={onApproveLeaveSubmit}
          handleCloseApproveLeave={this.handleCloseApproveLeave}
          isApproveLeaveFetching={isApproveLeaveFetching}
          approveLeavemessage={approveLeavemessage}
        />
      );
    }

    if (this.state.isEditing) {
      return (
        <EditLeave
          pending_items={pending_items}
          public_holiday={public_holiday}
          listID={this.state.listID}
          onEditLeaveSubmit={onEditLeaveSubmit}
          isEditLeaveFetching={isEditLeaveFetching}
          editLeaveMessage={editLeaveMessage}
          handleCloseEdit={this.handleCloseEdit}
        />
      );
    }

    if (this.state.isDeclining) {
      return (
        <DeclineLeave
          pending_items={pending_items}
          listID={this.state.listID}
          onDeclineLeaveSubmit={onDeclineLeaveSubmit}
          declineLeaveMessage={declineLeaveMessage}
          isDeclineLeaveFetching={isDeclineLeaveFetching}
          handleCloseDecline={this.handleCloseDecline}
        />
      );
    }

    const itemNodes = this.props.pending_items.map(record => (
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
            onClick={this.handleOpenApproveLeave}
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

    return itemNodes.length > 0 ? (
      <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-light">
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
}
