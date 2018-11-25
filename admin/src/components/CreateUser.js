// @flow
import React, { useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const moment = require('moment');

type Props = {
  dispatch: Function,
  onNewUserRecordSubmit: Function,
  message: string,
  isFetching: boolean
};

// type State = {
//   errorMessage: string,
//   surname: string,
//   otherNames: string,
//   staffEmail: string,
//   designation: string,
//   gender: string,
//   familyCareLeave: string,
//   annualDays: string,
//   sickDays: string,
//   bereavementDays: string,
//   christmasDays: string,
//   dob: any
//   employeeNumber: any,
//   employeeStartDate: any,
//   maternityLeave: string,
//   paternityLeave: string,
// };

export default function CreateUserForm(props: Props) {
  const [errorMessage, setErrorMessage] = useState('');
  const [surname, setSurname] = useState('');
  const [otherNames, setOtherNames] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [annualDays, setAnnualLeave] = useState('');
  const [sickDays, setSickLeave] = useState('');
  const [bereavementDays, setBereavementLeave] = useState('');
  const [familyCareDays, setFamilyCareLeave] = useState('');
  const [christmasDays, setChristmasLeave] = useState('');
  const [dob, setDob] = useState(null);
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [employeeStartDate, setEmployeeStartDate] = useState(null);
  const [maternityLeave, setMaternityLeave] = useState('');
  const [paternityLeave, setPaternityLeave] = useState('');

  function handleSurnameChange({ target }: SyntheticInputEvent<>) {
    setSurname(target.value);
  }

  function handleOtherNamesChange({ target }: SyntheticInputEvent<>) {
    setOtherNames(target.value);
  }

  function handleStaffEmailChange({ target }: SyntheticInputEvent<>) {
    setStaffEmail(target.value);
  }

  function handleDesignationChange({ target }: SyntheticInputEvent<>) {
    setDesignation(target.value);
  }

  function handleGenderChange({ target }: SyntheticInputEvent<>) {
    setGender(target.value);
  }

  function handleAnnualLeaveChange({ target }: SyntheticInputEvent<>) {
    setAnnualLeave(target.value);
  }

  function handleSickLeaveChange({ target }: SyntheticInputEvent<>) {
    setSickLeave(target.value);
  }

  function handleFamilyCareLeaveChange({ target }: SyntheticInputEvent<>) {
    setFamilyCareLeave(target.value);
  }

  function handleBereavementLeaveChange({ target }: SyntheticInputEvent<>) {
    setBereavementLeave(target.value);
  }

  function handleChristmasLeaveChange({ target }: SyntheticInputEvent<>) {
    setChristmasLeave(target.value);
  }

  function handleMaternityLeaveChange({ target }: SyntheticInputEvent<>) {
    setMaternityLeave(target.value);
  }

  function handlePaternityLeaveChange({ target }: SyntheticInputEvent<>) {
    setPaternityLeave(target.value);
  }

  function handleDOBChange(e: Event) {
    setDob(e);
  }

  function handleEmployeeNumberChange({ target }: SyntheticInputEvent<>) {
    setEmployeeNumber(target.value);
  }

  function handleEmployeeStartDateChange(e: Event) {
    setEmployeeStartDate(e);
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    const maternityDays = maternityLeave ? maternityLeave : 0;
    const paternityDays = paternityLeave ? paternityLeave : 0;
    const dateOfBirth = moment(dob).format('DD/MM/YYYY');
    const eStartDate = moment(employeeStartDate).format('DD/MM/YYYY');

    // verify data
    if (
      !surname ||
      !otherNames ||
      !staffEmail ||
      !designation ||
      !annualDays ||
      !sickDays ||
      !bereavementDays ||
      !familyCareDays ||
      !christmasDays ||
      !dateOfBirth ||
      !gender
    ) {
      setErrorMessage('One or more required fields are missing!');
      return null;
    }

    const adminUser = localStorage.getItem('admin_user');

    // prepare data to post to database
    const newUserDetails = {
      surname: surname,
      othernames: otherNames,
      staffEmail: staffEmail,
      designation: designation,
      annualDays: annualDays,
      sickDays: sickDays,
      bereavementDays: bereavementDays,
      familyCareDays: familyCareDays,
      christmasDays: christmasDays,
      dateOfBirth: dateOfBirth,
      maternityDays: maternityDays,
      paternityDays: paternityDays,
      gender: gender,
      employeeNumber: employeeNumber,
      employeeStartDate: eStartDate,
      adminUser: adminUser
    };

    setErrorMessage('');
    setSurname('');
    setOtherNames('');
    setAnnualLeave('');
    setStaffEmail('');
    setDesignation('');
    setGender('');
    setSickLeave('');
    setBereavementLeave('');
    setFamilyCareLeave('');
    setChristmasLeave('');
    setMaternityLeave('');
    setPaternityLeave('');
    setEmployeeNumber(0);
    setDob(null);
    setEmployeeStartDate(null);

    props.onNewUserRecordSubmit(newUserDetails);
  }

  let staffGender = gender.toLowerCase();
  const { isFetching, message } = props;

  return (
    <div className="container">
      <div className="col-md-6 ml-auto mr-auto pb-2">
        <div className="card card-body shadow p-3 mb-5 bg-white rounded">
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="surName">Surname</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Surname"
                    id="surName"
                    value={surname}
                    onChange={handleSurnameChange}
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
                    value={otherNames}
                    onChange={handleOtherNamesChange}
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
                value={staffEmail}
                onChange={handleStaffEmailChange}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="designation">Designation</label>
                  <select
                    className="form-control"
                    id="designation"
                    value={designation}
                    onChange={handleDesignationChange}
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
                    value={gender}
                    onChange={handleGenderChange}
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
                    step="0.1"
                    className="form-control"
                    placeholder="Annual leave"
                    id="annualLeave"
                    value={annualDays}
                    onChange={handleAnnualLeaveChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="sickLeave">Sick leave</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    placeholder="Sick leave"
                    id="sickLeave"
                    value={sickDays}
                    onChange={handleSickLeaveChange}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="bereavementLeave">Bereavement leave</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    placeholder="Bereavement leave"
                    id="bereavementLeave"
                    value={bereavementDays}
                    onChange={handleBereavementLeaveChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="familyCareLeave">Family care leave</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    placeholder="Family care leave"
                    id="familyCareLeave"
                    value={familyCareDays}
                    onChange={handleFamilyCareLeaveChange}
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
                    step="0.1"
                    className="form-control"
                    placeholder="Christmas leave"
                    id="christmasLeave"
                    value={christmasDays}
                    onChange={handleChristmasLeaveChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dob">Date of birth</label>
                  <DatePicker
                    className="form-control"
                    dateFormat="DD/MM/YYYY"
                    placeholderText="Click to select a date"
                    selected={dob}
                    onChange={handleDOBChange}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="employeeNumber">Employee number</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Employee number"
                    id="employeeNumber"
                    value={employeeNumber}
                    onChange={handleEmployeeNumberChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dob">Employee start date</label>
                  <DatePicker
                    className="form-control"
                    dateFormat="DD/MM/YYYY"
                    placeholderText="Click to select a date"
                    selected={employeeStartDate}
                    onChange={handleEmployeeStartDateChange}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
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
                      step="0.1"
                      className="form-control"
                      placeholder="Maternity leave"
                      id="maternityLeave"
                      value={maternityLeave}
                      onChange={handleMaternityLeaveChange}
                    />
                  </div>
                </div>
              )}
              {staffGender === 'male' && (
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="Paternity leave">Paternity leave</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      placeholder="Paternity leave"
                      id="paternityLeave"
                      value={paternityLeave}
                      onChange={handlePaternityLeaveChange}
                    />
                  </div>
                </div>
              )}
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
            <div>{errorMessage}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
