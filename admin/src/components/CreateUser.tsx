import React, { useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios';

const moment = require('moment');

interface NewUserProps {
  surname: string;
  othernames: string;
  staffEmail: string;
  designation: string;
  annualDays: number | string;
  sickDays: number | string;
  bereavementDays: number | string;
  familyCareDays: number | string;
  christmasDays: number | string;
  dateOfBirth: Date;
  maternityDays: number | string;
  paternityDays: number | string;
  gender: string;
  employeeNumber: number | string;
  employeeStartDate: Date;
  adminUser: string | null;
}

export default function CreateUserForm(): JSX.Element {
  const [surname, setSurname] = useState<string>('');
  const [otherNames, setOtherNames] = useState<string>('');
  const [staffEmail, setStaffEmail] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [annualDays, setAnnualLeave] = useState<number | string>('');
  const [sickDays, setSickLeave] = useState<number | string>('');
  const [bereavementDays, setBereavementLeave] = useState<number | string>('');
  const [familyCareDays, setFamilyCareLeave] = useState<number | string>('');
  const [christmasDays, setChristmasLeave] = useState<number | string>('');
  const [dob, setDob] = useState<Date | null>(null);
  const [employeeNumber, setEmployeeNumber] = useState<number | string>('');
  const [employeeStartDate, setEmployeeStartDate] = useState<Date | null>(null);
  const [maternityLeave, setMaternityLeave] = useState<number | string>('');
  const [paternityLeave, setPaternityLeave] = useState<number | string>('');
  const [serverMessage, setServerMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  function handleSurnameChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setSurname(target.value);
  }

  function handleOtherNamesChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setOtherNames(target.value);
  }

  function handleStaffEmailChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setStaffEmail(target.value);
  }

  function handleDesignationChange({
    target
  }: React.ChangeEvent<HTMLSelectElement>): void {
    setDesignation(target.value);
  }

  function handleGenderChange({
    target
  }: React.ChangeEvent<HTMLSelectElement>): void {
    setGender(target.value);
  }

  function handleAnnualLeaveChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setAnnualLeave(target.value);
  }

  function handleSickLeaveChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setSickLeave(target.value);
  }

  function handleFamilyCareLeaveChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setFamilyCareLeave(target.value);
  }

  function handleBereavementLeaveChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setBereavementLeave(target.value);
  }

  function handleChristmasLeaveChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setChristmasLeave(target.value);
  }

  function handleMaternityLeaveChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setMaternityLeave(target.value);
  }

  function handlePaternityLeaveChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setPaternityLeave(target.value);
  }

  function handleDOBChange(e: React.SetStateAction<Date | null>): void {
    setDob(e);
  }

  function handleEmployeeNumberChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setEmployeeNumber(target.value);
  }

  function handleEmployeeStartDateChange(
    e: React.SetStateAction<Date | null>
  ): void {
    setEmployeeStartDate(e);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

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
      !dob ||
      !gender ||
      !employeeNumber ||
      !employeeStartDate
    ) {
      setErrorMessage('One or more required fields are missing!');
      return;
    }

    const maternityDays = maternityLeave ? maternityLeave : 0;
    const paternityDays = paternityLeave ? paternityLeave : 0;
    const dateOfBirth = moment(dob).format('DD/MM/YYYY');
    const eStartDate = moment(employeeStartDate).format('DD/MM/YYYY');

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
    setServerMessage('');

    newUserRecord(newUserDetails);
  }

  async function newUserRecord(newUserDetails: NewUserProps): Promise<any> {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/adduser', {
        surname: newUserDetails.surname,
        othernames: newUserDetails.othernames,
        email: newUserDetails.staffEmail,
        designation: newUserDetails.designation,
        annual: newUserDetails.annualDays,
        sick: newUserDetails.sickDays,
        bereavement: newUserDetails.bereavementDays,
        family_care: newUserDetails.familyCareDays,
        christmas: newUserDetails.christmasDays,
        date_of_birth: newUserDetails.dateOfBirth,
        maternity: newUserDetails.maternityDays,
        paternity: newUserDetails.paternityDays,
        gender: newUserDetails.gender,
        employee_number: newUserDetails.employeeNumber,
        employee_start_date: newUserDetails.employeeStartDate,
        admin_user: newUserDetails.adminUser
      });

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data);
      } else {
        setServerMessage(response.data.message);
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
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  let staffGender = gender.toLowerCase();

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
                    dateFormat="dd/MM/YYYY"
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
                    dateFormat="dd/MM/YYYY"
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
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              serverMessage
            )}
          </div>
          <div className="text-danger text-center">
            <div>{errorMessage}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
