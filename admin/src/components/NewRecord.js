import React, { Component, PropTypes } from "react";

var DatePicker = require("react-datepicker");
require("react-datepicker/dist/react-datepicker.css");

const moment = require("moment");

export default class NewRecordForm extends Component {
  constructor() {
    super();
    this.state = { errorMessage: "", successMessage: "" };
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

  handleSurnameChange(e) {
    this.setState({ surname: e.target.value });
  }

  handleOtherNamesChange(e) {
    this.setState({ otherNames: e.target.value });
  }

  handleStaffEmailChange(e) {
    this.setState({ staffEmail: e.target.value });
  }

  handleDesignationChange(e) {
    this.setState({ designation: e.target.value });
  }

  handleGenderChange(e) {
    this.setState({ gender: e.target.value });
  }

  handleAnnualLeaveChange(e) {
    this.setState({ annualLeave: e.target.value });
  }

  handleSickLeaveChange(e) {
    this.setState({ sickLeave: e.target.value });
  }

  handleChristmasLeaveChange(e) {
    this.setState({ christmasLeave: e.target.files[0] });
  }

  handleBereavementLeaveChange(e) {
    this.setState({ bereavementLeave: e.target.value });
  }

  handleMaternityLeaveChange(e) {
    this.setState({ maternityLeave: e.target.value });
  }

  handleDOBChange(e) {
    this.setState({ dob: e });
  }

  handleSubmit(e) {
    e.preventDefault();
    const surname = this.state.surname;
    const othernames = this.state.otherNames;
    const staffEmail = this.state.staffEmail;
    const designation = this.state.designation;
    const gender = this.state.gender;
    const annualDays = this.state.annualLeave;
    const sickDays = this.state.sickLeave;
    const bereavmentDays = this.state.bereavementLeave;
    const christmasDays = this.state.christmasLeave;
    const maternityDays = this.state.maternityLeave
      ? this.state.maternityLeave
      : null;
    const dateOfBirth = moment(this.state.dob).format("MM DD YYYY");
    // verify data
    if (
      !surname ||
      !othernames ||
      !staffEmail ||
      !designation ||
      !annualDays ||
      !sickDays ||
      !bereavmentDays ||
      !christmasDays ||
      !dateOfBirth ||
      gender
    ) {
      this.setState({
        errorMessage: "One or more required fields are missing!"
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
      bereavmentDays: bereavmentDays,
      christmasDays: christmasDays,
      dateOfBirth: dateOfBirth,
      maternityDays: maternityDays,
      gender: gender
    };
    this.props.onNewUserRecordSubmit(newUserDetails);
  }

  render() {
    let staffGender = this.state.gender
      ? this.state.gender.toLowerCase()
      : "female";
    const { isFetching, message } = this.props;

    return (
      <div className="container">
        <div className="col-md-5 offset-md-3 pb-2">
          <div className="card card-block">
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
                      <option>
                        Admin
                      </option>
                      <option>
                        Level 3 Lawyer
                      </option>
                      <option>
                        Level 4 Lawyer
                      </option>
                      <option>
                        Level 3 Secretary
                      </option>
                      <option>
                        Level 4 Secretary
                      </option>
                      <option>
                        TM
                      </option>
                      <option>
                        Accounts
                      </option>
                      <option>
                        Library
                      </option>
                      <option>
                        IT
                      </option>
                      <option>
                        Search Clerk Level 3
                      </option>
                      <option>
                        Search Clerk Level 4
                      </option>
                      <option>
                        Legal Executive
                      </option>
                      <option>
                        Partner
                      </option>
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
                      <option>
                        Male
                      </option>
                      <option>
                        Female
                      </option>
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
                {staffGender === "female" &&
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
                  </div>}
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
            <div className="text-danger text-center">
              {isFetching ? <div>Loading...</div> : message}
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

NewRecordForm.propTypes = {
  onNewUserRecordSubmit: PropTypes.func.isRequired,
  message: PropTypes.string,
  isFetching: PropTypes.bool.isRequired
};
