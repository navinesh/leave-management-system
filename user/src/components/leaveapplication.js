import React, { Component, PropTypes } from 'react'
var Loader = require('halogen/ClipLoader');
var DatePicker = require('react-datepicker');
var moment = require('moment');
require('moment-range');

export default class LeaveApplications extends Component {
  constructor() {
    super()
    this.state = {
      errorMessage: '',
      successMessage: ''
    };
    this.handleLeaveChange = this.handleLeaveChange.bind(this);
    this.handleLeaveTypeChange = this.handleLeaveTypeChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSupervisorEmailChange = this.handleSupervisorEmailChange.bind(this);
    this.handleSecretaryEmailChange = this.handleSecretaryEmailChange.bind(this);
    this.handleReasonChange = this.handleReasonChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLeaveChange (e) {
    this.setState({leave: e.target.value});
  }

  handleLeaveTypeChange (e) {
    this.setState({leaveType: e.target.value});
  }

  handleStartDateChange (e) {
     this.setState({startDate: e});
   }

   handleEndDateChange (e) {
     this.setState({endDate: e});
   }

  handleSupervisorEmailChange (e) {
    this.setState({supervisorEmail: e.target.value});
  }

  handleSecretaryEmailChange (e) {
    this.setState({secretaryEmail: e.target.value});
  }

  handleReasonChange (e) {
    this.setState({reason: e.target.value});
  }

  handleFileChange (e) {
    this.setState({sickSheet: e.target.files[0]});
  }

  handleSubmit (e) {
    e.preventDefault();
    const { user_detail } = this.props
    const user_id = user_detail.id;
    const annualDays = user_detail.annual;
    const sickDays = user_detail.sick;
    const bereavmentDays = user_detail.bereavement;
    const christmasDays = user_detail.christmas;
    const dateOfBirth = user_detail.date_of_birth;
    const maternityDays = user_detail.maternity ? user_detail.maternity : null;

    const leave = this.state.leave;
    const leaveType = this.state.leaveType;
    const startDate = this.state.startDate ? this.state.startDate : null;
    const endDate = this.state.endDate ? this.state.endDate : null;
    const supervisorEmail = this.state.supervisorEmail ? this.state.supervisorEmail.trim() : null;
    const secretaryEmail = this.state.secretaryEmail ? this.state.secretaryEmail.trim() : null;
    const reason = this.state.reason ? this.state.reason.trim() : null;
    const sickSheet = this.state.sickSheet ? this.state.sickSheet : null;

    if (!user_id || !leave || !leaveType || !startDate || !endDate || !supervisorEmail || !reason) {
      this.setState({errorMessage: 'One or more required fields are missing!'});
      return;
    }

    // get date range from user selection
    const leaveRangeDays = (endDate.diff(startDate, 'days') + 1);

    // check user data range selection
    if (leaveRangeDays <= 0) {
      this.setState({ errorMessage: 'The dates you selected are invalid!'});
      return;
    }

    // create date range
    const range = moment.range(startDate, endDate);

    const dateRange = [];
    range.by('days', moment => {
      dateRange.push(moment.format("DD, MM, YYYY"));
    });

    const weekend = [];
    range.by('days', moment => {
      if (moment.isoWeekday() === 6 || moment.isoWeekday() === 7) {
        weekend.push(moment.format("DD, MM, YYYY"));
      }
    });

    // exclude weekends
    const dateRangeSet = new Set(dateRange);
    const weekendSet = new Set(weekend);
    const daysExcludingWeekendSet = new Set([...dateRangeSet].filter(x => !weekendSet.has(x)));

    // exclude public holidays
    // to-do get public holiday dates from db
    const publicHolidays = ["07, 09, 2016", "08, 09, 2016"];
    const publicHolidaysSet = new Set(publicHolidays);
    const daysExcludingHolidaysSet = new Set([...daysExcludingWeekendSet].filter(x => !publicHolidaysSet.has(x)));
    const leaveDays = daysExcludingHolidaysSet.size;

    // if half day then subtract 0.5
    const myLeaveDays = (leaveType === 'half day am' || leaveType === 'half day pm' ? leaveDays - 0.5 : leaveDays)

    // calculate total leave days
    const getLeaveDays = (type) => {
      const totalDays = {
        'annual': () => {
          return annualDays - myLeaveDays;
        },
        'sick': () => {
          return ((myLeaveDays >= 2 || sickDays <= 6) && !sickSheet ? null : sickDays - myLeaveDays)
        },
        'bereavement': () => {
          return bereavmentDays - myLeaveDays;
        },
        'christmas': () => {
          return christmasDays - myLeaveDays;
        },
        'birthday': () => {
          // create date
          const dOB = new Date(dateOfBirth);
          dOB.setHours(dOB.getHours() - 12);
          const birthDate = moment.utc(dOB);
          // check date of birth
          return (moment(startDate).isSame(birthDate) && moment(endDate).isSame(birthDate) ? myLeaveDays : undefined)
        },
        'maternity': () => {
          return maternityDays - myLeaveDays;
        },

        'lwop': () => {
          return myLeaveDays;
        },
        'other': () => {
          return myLeaveDays;
        }
      };
      return (totalDays[type])();
    }

    const applicationDays = getLeaveDays(leave)

    if(applicationDays < 0) {
      this.setState({errorMessage: 'Your leave balance cannot be negative!'});
      return;
    }

    if(applicationDays === null) {
      this.setState({errorMessage: 'A medical certificate is required for absence of two consecutive days or more and after four single day absences!'});
      return;
    }

    if(applicationDays === undefined) {
      this.setState({errorMessage: 'The date you selected as your date of birth does not match our record!'});
      return;
    }

    const sDate = moment(startDate).format("DD/MM/YYYY");
    const eDate = moment(endDate).format("DD/MM/YYYY");

    this.setState({errorMessage: ''});
    this.setState({successMessage: 'Your application has been submitted.'});

    const applicationDetails = { user_id: user_id, leave: leave, leaveType: leaveType,
      startDate: sDate, endDate: eDate, supervisorEmail: supervisorEmail,
      secretaryEmail: secretaryEmail, reason: reason, leaveDays: myLeaveDays,
      applicationDays: applicationDays, sickSheet: sickSheet }
    this.props.onLeaveApplicationClick(applicationDetails)
  }

  render(){
    const { isFetching, message, user_detail } = this.props
    if (this.state.successMessage) {
      return(
        <div className="container text-xs-center" style={{paddingTop: '100px'}}>
          <div className="col-sm-12">
            <h1 className="display-4">{this.state.successMessage}</h1>
            <br />
            <a className="btn btn-outline-primary btn-lg" href="/leaveapplication">apply for leave</a>
          </div>
        </div>
      )
    }
    else {
      return(
        <div className="LeaveApplications">
          <div className="col-xs-12 col-sm-3 offset-sm-1">
            <p>{user_detail.othernames} {user_detail.surname}</p>
            <ul className="list-group">
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{user_detail.annual}</span>
                Annual
              </li>
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{user_detail.sick}</span>
                Sick
              </li>
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{user_detail.bereavement}</span>
                Bereavement
              </li>
              <li className="list-group-item">
                <span className="tag tag-primary tag-pill pull-xs-right">{user_detail.christmas}</span>
                Christmas
              </li>
              {user_detail.maternity ?
                <li className="list-group-item">
                  <span className="tag tag-primary tag-pill pull-xs-right">{user_detail.maternity}</span>
                  Maternity
                </li>
                : ''}
            </ul>
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="card card-block">
              <form encType='multipart/form-data' onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="leave">Leave</label>
                  <select className="form-control" id="leave" onChange={this.handleLeaveChange}>
                    <option></option>
                    <option>annual</option>
                    <option>sick</option>
                    <option>bereavement</option>
                    <option>christmas</option>
                    <option>birthday</option>
                    <option>maternity</option>
                    <option>lwop</option>
                    <option>other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="leaveType">Leave type</label>
                  <select className="form-control" id="leaveType" onChange={this.handleLeaveTypeChange}>
                    <option></option>
                    <option>full</option>
                    <option>half day am</option>
                    <option>half day pm</option>
                  </select>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label htmlFor="startDate">Start date</label>
                      <DatePicker className="form-control"
                        selected={this.state.startDate}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.handleStartDateChange} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label htmlFor="endDate">End date</label>
                      <DatePicker className="form-control"
                        selected={this.state.endDate}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.handleEndDateChange} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="supervisorEmail">Supervisor email</label>
                  <input type="email" className="form-control"
                    placeholder="Supervisor email" id="supervisorEmail"
                    onChange={this.handleSupervisorEmailChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="secretaryEmail">Second supervisor / secretary email</label>
                  <input type="email" className="form-control"
                    placeholder="Second supervisor / secretary email" id="secretaryEmail"
                    onChange={this.handleSecretaryEmailChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="reason">Reason</label>
                  <input type="text" className="form-control"
                    placeholder="Reason for leave" id="reason"
                    onChange={this.handleReasonChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="sicksheet">Sick sheet</label>
                  <input type="file" className="form-control-file" id="sicksheet"
                    onChange={this.handleFileChange} />
                  <small className="form-text text-muted">A medical certificate is required for absence of two consecutive days or more and after four single day absences.</small>
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary col-xs-12 col-sm-12">Submit</button>
                </div>
              </form>
              <div className="text-danger text-xs-center">
                {isFetching ?
                  <Loader color="#0275d8" size="20px" />:
                  message}
              </div>
              <div className="text-danger text-xs-center p-t-2">
                {this.state.errorMessage ?
                  <div>{this.state.errorMessage}</div> :
                     ''}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

LeaveApplications.propTypes = {
  onLeaveApplicationClick: PropTypes.func.isRequired,
  message: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  user_detail: PropTypes.object.isRequired
}
