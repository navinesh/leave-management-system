// @flow
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import '../spinners.css';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const USER_DETAIL = gql`
  query($id: ID!) {
    user(id: $id) {
      dbId
      othernames
      surname
      annual
      sick
      bereavement
      christmas
      maternity
      gender
    }
  }
`;

const USER_RECORD = gql`
  query($id: ID!) {
    user(id: $id) {
      leaverecord {
        edges {
          node {
            id
            leaveName
            leaveDays
            startDate
            endDate
            leaveReason
            leaveStatus
          }
        }
      }
    }
  }
`;

const PUBLIC_HOLIDAY = gql`
  {
    publicHoliday {
      edges {
        node {
          holidayDate
        }
      }
    }
  }
`;

const UserName = props => (
  <p>
    {props.user_detail.othernames} {props.user_detail.surname}
  </p>
);

const UserRecord = props => {
  let gender = props.user_detail.gender
    ? props.user_detail.gender.toLowerCase()
    : null;

  return (
    <ul className="list-group">
      <li className="list-group-item">
        Annual
        <span className="badge badge-primary badge-pill float-right">
          {props.user_detail.annual}
        </span>
      </li>
      <li className="list-group-item">
        Sick
        <span className="badge badge-primary badge-pill float-right">
          {props.user_detail.sick}
        </span>
      </li>
      <li className="list-group-item">
        Bereavement
        <span className="badge badge-primary badge-pill float-right">
          {props.user_detail.bereavement}
        </span>
      </li>
      <li className="list-group-item">
        Christmas
        <span className="badge badge-primary badge-pill float-right">
          {props.user_detail.christmas}
        </span>
      </li>
      {gender === 'female' &&
        props.user_detail.maternity > 0 && (
          <li className="list-group-item">
            Maternity
            <span className="badge badge-primary badge-pill float-right">
              {props.user_detail.maternity}
            </span>
          </li>
        )}
    </ul>
  );
};

type leaveApplicationProps = {
  id: Number,
  user_detail: Object,
  user_record: Object,
  public_holiday: Object,
  onLeaveApplicationClick: Function,
  refetch: Function
};

type leaveApplicationState = {
  leave: string,
  leaveType: string,
  startDate: any,
  endDate: any,
  supervisorEmail: string,
  secretaryEmail: string,
  reason: string,
  sickSheet: any,
  errorMessage: string,
  checkingMessage: string,
  focusedInput: ?boolean
};

class LeaveApplication extends Component<
  leaveApplicationProps,
  leaveApplicationState
> {
  handleLeaveChange: Function;
  handleLeaveTypeChange: Function;
  handleSupervisorEmailChange: Function;
  handleSecretaryEmailChange: Function;
  handleReasonChange: Function;
  handleFileChange: Function;
  handleSubmit: Function;
  handleUserConfirm: Function;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      checkingMessage: '',
      leave: '',
      leaveType: '',
      startDate: null,
      endDate: null,
      supervisorEmail: '',
      secretaryEmail: '',
      reason: '',
      sickSheet: '',
      focusedInput: null
    };

    this.handleLeaveChange = this.handleLeaveChange.bind(this);
    this.handleLeaveTypeChange = this.handleLeaveTypeChange.bind(this);
    this.handleSupervisorEmailChange = this.handleSupervisorEmailChange.bind(
      this
    );
    this.handleSecretaryEmailChange = this.handleSecretaryEmailChange.bind(
      this
    );
    this.handleReasonChange = this.handleReasonChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserConfirm = this.handleUserConfirm.bind(this);
  }

  handleLeaveChange({ target }: SyntheticInputEvent<>) {
    this.setState({ leave: target.value });
  }

  handleLeaveTypeChange({ target }: SyntheticInputEvent<>) {
    this.setState({ leaveType: target.value });
  }

  handleSupervisorEmailChange({ target }: SyntheticInputEvent<>) {
    this.setState({ supervisorEmail: target.value });
  }

  handleSecretaryEmailChange({ target }: SyntheticInputEvent<>) {
    this.setState({ secretaryEmail: target.value });
  }

  handleReasonChange({ target }: SyntheticInputEvent<>) {
    this.setState({ reason: target.value });
  }

  handleFileChange({ target }: SyntheticInputEvent<>) {
    this.setState({ sickSheet: target.files[0] });
  }

  handleUserConfirm() {
    this.setState({ checkingMessage: '' });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const {
      user_detail,
      user_record,
      onLeaveApplicationClick,
      refetch
    } = this.props;

    const user_id = user_detail.dbId;
    const annualDays = user_detail.annual;
    const sickDays = user_detail.sick;
    const bereavementDays = user_detail.bereavement;
    const christmasDays = user_detail.christmas;
    const dateOfBirth = user_detail.date_of_birth;
    const maternityDays = user_detail.maternity ? user_detail.maternity : null;
    const leave = this.state.leave;
    const leaveType = this.state.leaveType;
    const startDate = this.state.startDate ? this.state.startDate : null;
    const endDate = this.state.endDate ? this.state.endDate : null;
    const supervisorEmail = this.state.supervisorEmail
      ? this.state.supervisorEmail.trim()
      : null;
    const secretaryEmail = this.state.secretaryEmail
      ? this.state.secretaryEmail.trim()
      : null;
    const reason = this.state.reason ? this.state.reason.trim() : null;
    const sickSheet = this.state.sickSheet ? this.state.sickSheet : null;

    if (
      !user_id ||
      !leave ||
      !leaveType ||
      !startDate ||
      !endDate ||
      !supervisorEmail ||
      !reason
    ) {
      this.setState({
        errorMessage: 'One or more required fields are missing!'
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
    const publicHolidays = this.props.public_holiday.edges.map(item => {
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

    // get total of approved single sick leave days
    const approvedSingleSickLeaves = user_record.leaverecord.edges.filter(
      e =>
        e.node.leaveStatus === 'approved' &&
        e.node.leaveName === 'sick' &&
        e.node.fileName === null &&
        e.node.leaveDays === 1
    );

    // calculate total leave days
    const getLeaveDays = type => {
      const totalDays = {
        annual: () => {
          return annualDays - myLeaveDays;
        },
        sick: () => {
          return (myLeaveDays >= 2 || approvedSingleSickLeaves.length >= 4) &&
            !sickSheet
            ? null
            : sickDays - myLeaveDays;
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
          if (!sickSheet) {
            return false;
          } else {
            if (maternityDays) {
              return maternityDays - myLeaveDays;
            }
          }
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
      this.setState({ errorMessage: 'Your leave balance cannot be negative!' });
      return;
    }

    if (applicationDays === false) {
      this.setState({
        errorMessage: 'A medical certificate is required for maternity leave!'
      });
      return;
    }

    if (applicationDays === null) {
      this.setState({
        errorMessage:
          'A medical certificate is required for absence of two consecutive days or more and after four single day absences!'
      });
      return;
    }

    if (applicationDays === undefined) {
      this.setState({
        errorMessage:
          'The date you selected as your date of birth does not match our record!'
      });
      return;
    }

    const sDate = moment(startDate).format('DD/MM/YYYY');
    const eDate = moment(endDate).format('DD/MM/YYYY');

    this.setState({
      errorMessage: '',
      startDate: null,
      endDate: null,
      checkingMessage: 'Checking...'
    });

    const applicationDetails = {
      user_id: user_id,
      leave: leave,
      leaveType: leaveType,
      startDate: sDate,
      endDate: eDate,
      supervisorEmail: supervisorEmail,
      secretaryEmail: secretaryEmail,
      reason: reason,
      leaveDays: myLeaveDays,
      applicationDays: applicationDays,
      sickSheet: sickSheet
    };

    onLeaveApplicationClick(applicationDetails);

    refetch();
  }

  render() {
    const { user_detail } = this.props;
    let gender = user_detail.gender ? user_detail.gender.toLowerCase() : null;

    if (this.state.checkingMessage) {
      return <div className="loader" />;
    }

    return (
      <div className="card card-body">
        <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="leave">Leave</label>
                <select
                  className="form-control"
                  id="leave"
                  onChange={this.handleLeaveChange}
                >
                  <option />
                  <option>annual</option>
                  <option>sick</option>
                  <option>bereavement</option>
                  <option>christmas</option>
                  <option>birthday</option>
                  {gender === 'female' && <option>maternity</option>}
                  <option>lwop</option>
                  <option>other</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="leaveType">Leave type</label>
                <select
                  className="form-control"
                  id="leaveType"
                  onChange={this.handleLeaveTypeChange}
                >
                  <option />
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
                <label htmlFor="startDate-endDate">Start date - End date</label>
                <DateRangePicker
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
                  displayFormat="DD/MM/YYYY"
                  renderCalendarInfo={() => (
                    <p className="text-center">
                      To select a single day click the date twice.
                    </p>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="supervisorEmail">Supervisor email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Supervisor email"
              id="supervisorEmail"
              onChange={this.handleSupervisorEmailChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="secretaryEmail">
              Second supervisor / secretary email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Second supervisor / secretary email"
              id="secretaryEmail"
              onChange={this.handleSecretaryEmailChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <input
              type="text"
              className="form-control"
              placeholder="Reason for leave"
              id="reason"
              onChange={this.handleReasonChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sicksheet">Sick sheet</label>
            <input
              type="file"
              className="form-control-file"
              id="sicksheet"
              onChange={this.handleFileChange}
            />
            <small className="form-text text-muted">
              A medical certificate is required for absence of two consecutive
              days or more and after four single day absences.
            </small>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary col">
              Submit
            </button>
          </div>
        </form>
        <div className="text-danger text-center pt-2">
          <div>{this.state.errorMessage}</div>
        </div>
      </div>
    );
  }
}

type Props = {
  id: Number,
  userDetails: Object,
  userRecords: Object,
  publicHolidays: Object,
  onLeaveApplicationClick: Function,
  message: string,
  dispatch: Function
};

const Application = (props: Props) => {
  const {
    userDetails: { loading, error, user },
    userRecords: {
      loading: recordLoading,
      error: recordError,
      refetch,
      user: userRecord
    },
    publicHolidays: {
      loading: holidayLoading,
      error: holidayError,
      publicHoliday
    },
    message,
    dispatch
  } = props;

  if (loading || recordLoading || holidayLoading) {
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <div className="loader1" />
        </div>
      </div>
    );
  }

  if (error || recordError || holidayError) {
    console.log(error.message, recordError.message, holidayError.message);
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <p>Something went wrong!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '80px' }}>
      <div className="row">
        <div className="col-md-12">
          <div className="col-md-9 ml-auto mr-auto">
            <UserName user_detail={user} />
          </div>
        </div>
        <div className="col-md-3 ml-auto">
          <UserRecord user_detail={user} />
        </div>
        <div className="col-md-6 mr-auto mb-2">
          {message ? (
            <div className="card">
              <div className="card-body text-center">
                <p>{message}</p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    dispatch({
                      type: 'CLEAR_LEAVE_APPLICATION_MESSAGE'
                    })
                  }
                >
                  Apply for leave
                </button>
              </div>
            </div>
          ) : (
            <LeaveApplication
              id={props.id}
              user_detail={user}
              user_record={userRecord}
              public_holiday={publicHoliday}
              refetch={refetch}
              onLeaveApplicationClick={props.onLeaveApplicationClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default compose(
  graphql(USER_DETAIL, {
    options: ({ id }) => ({
      variables: { id }
    }),
    name: 'userDetails'
  }),
  graphql(USER_RECORD, {
    options: ({ id }) => ({
      variables: { id }
    }),
    name: 'userRecords'
  }),
  graphql(PUBLIC_HOLIDAY, { name: 'publicHolidays' })
)(Application);
