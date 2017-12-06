// @flow
import React, { Component } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const moment = require('moment');

type Props = {
  dispatch: Function,
  onNewUserRecordSubmit: Function,
  message: string,
  isFetching: boolean
};

type State = {
  errorMessage: string,
  successMessage: string,
  surname: string,
  otherNames: string,
  annualLeave: string,
  staffEmail: string,
  designation: string,
  gender: string,
  annualLeave: string,
  sickLeave: string,
  bereavementLeave: string,
  christmasLeave: string,
  maternityLeave: string,
  dob: any
};

export default class NewRecordForm extends Component<Props, State> {
  handleSurnameChange: Function;
  handleOtherNamesChange: Function;
  handleStaffEmailChange: Function;
  handleDesignationChange: Function;
  handleGenderChange: Function;
  handleDOBChange: Function;
  handleAnnualLeaveChange: Function;
  handleSickLeaveChange: Function;
  handleChristmasLeaveChange: Function;
  handleBereavementLeaveChange: Function;
  handleMaternityLeaveChange: Function;
  handleSubmit: Function;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      successMessage: '',
      surname: '',
      otherNames: '',
      annualLeave: '',
      staffEmail: '',
      designation: '',
      gender: '',
      sickLeave: '',
      bereavementLeave: '',
      christmasLeave: '',
      maternityLeave: '',
      dob: null
    };

    this.handleSurnameChange = this.handleSurnameChange.bind(this);
    this.handleOtherNamesChange = this.handleOtherNamesChange.bind(this);
    this.handleStaffEmailChange = this.handleStaffEmailChange.bind(this);
    this.handleDesignationChange = this.handleDesignationChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleDOBChange = this.handleDOBChange.bind(this);
    this.handleAnnualLeaveChange = this.handleAnnualLeaveChange.bind(this);
    this.handleSickLeaveChange = this.handleSickLeaveChange.bind(this);
    this.handleChristmasLeaveChange = this.handleChristmasLeaveChange.bind(
      this
    );
    this.handleBereavementLeaveChange = this.handleBereavementLeaveChange.bind(
      this
    );
    this.handleMaternityLeaveChange = this.handleMaternityLeaveChange.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSurnameChange({ target }: SyntheticInputEvent<>) {
    this.setState({ surname: target.value });
  }

  handleOtherNamesChange({ target }: SyntheticInputEvent<>) {
    this.setState({ otherNames: target.value });
  }

  handleStaffEmailChange({ target }: SyntheticInputEvent<>) {
    this.setState({ staffEmail: target.value });
  }

  handleDesignationChange({ target }: SyntheticInputEvent<>) {
    this.setState({ designation: target.value });
  }

  handleGenderChange({ target }: SyntheticInputEvent<>) {
    this.setState({ gender: target.value });
  }

  handleAnnualLeaveChange({ target }: SyntheticInputEvent<>) {
    this.setState({ annualLeave: target.value });
  }

  handleSickLeaveChange({ target }: SyntheticInputEvent<>) {
    this.setState({ sickLeave: target.value });
  }

  handleChristmasLeaveChange({ target }: SyntheticInputEvent<>) {
    this.setState({ christmasLeave: target.value });
  }

  handleBereavementLeaveChange({ target }: SyntheticInputEvent<>) {
    this.setState({ bereavementLeave: target.value });
  }

  handleMaternityLeaveChange({ target }: SyntheticInputEvent<>) {
    this.setState({ maternityLeave: target.value });
  }

  handleDOBChange(e: Event) {
    this.setState({ dob: e });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const surname = this.state.surname;
    const othernames = this.state.otherNames;
    const staffEmail = this.state.staffEmail;
    const designation = this.state.designation;
    const gender = this.state.gender;
    const annualDays = this.state.annualLeave;
    const sickDays = this.state.sickLeave;
    const bereavementDays = this.state.bereavementLeave;
    const christmasDays = this.state.christmasLeave;
    const maternityDays = this.state.maternityLeave
      ? this.state.maternityLeave
      : null;
    const dateOfBirth = moment(this.state.dob).format('MM DD YYYY');

    // verify data
    if (
      !surname ||
      !othernames ||
      !staffEmail ||
      !designation ||
      !annualDays ||
      !sickDays ||
      !bereavementDays ||
      !christmasDays ||
      !dateOfBirth ||
      !gender
    ) {
      this.setState({
        errorMessage: 'One or more required fields are missing!'
      });
      return null;
    }

    // prepare data to post to database
    const newUserDetails = {
      surname: surname,
      othernames: othernames,
      staffEmail: staffEmail,
      designation: designation,
      annualDays: annualDays,
      sickDays: sickDays,
      bereavementDays: bereavementDays,
      christmasDays: christmasDays,
      dateOfBirth: dateOfBirth,
      maternityDays: maternityDays,
      gender: gender
    };

    this.props.onNewUserRecordSubmit(newUserDetails);

    setTimeout(() => {
      this.props.dispatch({ type: 'CLEAR_NEW_USER_RECORD' });
    }, 5000);
  }

  render() {
    let staffGender = this.state.gender
      ? this.state.gender.toLowerCase()
      : 'female';
    const { isFetching, message } = this.props;

    return (
      <div className="container">
        <div className="col-md-6 ml-auto mr-auto pb-2">
          <div className="card card-body">
            <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="surName">Surname</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Surname"
                      id="surName"
                      onChange={this.handleSurnameChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="otherNames">Other Names</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Other Names"
                      id="otherNames"
                      onChange={this.handleOtherNamesChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="staffEmail">Staff email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Staff email"
                  id="staffEmail"
                  onChange={this.handleStaffEmailChange}
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="designation">Designation</label>
                    <select
                      className="form-control"
                      id="designation"
                      onChange={this.handleDesignationChange}
                    >
                      <option />
                      <option>Admin</option>
                      <option>Level 3 Lawyer</option>
                      <option>Level 4 Lawyer</option>
                      <option>Level 3 Secretary</option>
                      <option>Level 4 Secretary</option>
                      <option>TM</option>
                      <option>Accounts</option>
                      <option>Library</option>
                      <option>IT</option>
                      <option>Search Clerk Level 3</option>
                      <option>Search Clerk Level 4</option>
                      <option>Legal Executive</option>
                      <option>Partner</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      className="form-control"
                      id="gender"
                      onChange={this.handleGenderChange}
                    >
                      <option />
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="annualLeave">Annual leave</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Annual leave"
                      id="annualLeave"
                      onChange={this.handleAnnualLeaveChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="sickLeave">Sick leave</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Sick leave"
                      id="sickLeave"
                      onChange={this.handleSickLeaveChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="christmasLeave">Christmas leave</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Christmas leave"
                      id="christmasLeave"
                      onChange={this.handleChristmasLeaveChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="bereavementLeave">Bereavement leave</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Bereavement leave"
                      id="bereavementLeave"
                      onChange={this.handleBereavementLeaveChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                {staffGender === 'female' && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="Maternity leave">Maternity leave</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Maternity leave"
                        id="maternityLeave"
                        onChange={this.handleMaternityLeaveChange}
                      />
                    </div>
                  </div>
                )}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="dob">Date of birth</label>
                    <DatePicker
                      className="form-control"
                      dateFormat="DD/MM/YYYY"
                      placeholderText="Click to select a date"
                      selected={this.state.dob}
                      onChange={this.handleDOBChange}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary col">
                  Submit
                </button>
              </div>
            </form>
            <div className="text-primary text-center">
              {isFetching ? <div className="loader" /> : message}
            </div>
            <div className="text-danger text-center">
              <div>{this.state.errorMessage}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
