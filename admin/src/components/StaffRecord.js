// @flow
import React, { Component } from 'react';

import { searchStaffRecord, fetchStaffRecord } from '../actions/StaffRecord';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../spinners.css';

const moment = require('moment');

const Search = props =>
  <div className="row">
    <div className="col-md-3">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          onChange={props.handleSearchChange}
        />
      </div>
    </div>
  </div>;

const ArchiveUser = props =>
  <div>
    {props.staff_record.filter(e => e.id === props.listID).map(record =>
      <div key={record.id}>
        <div className="col-md-6 offset-md-3" style={{ paddingTop: '10px' }}>
          <div className="card">
            <h5 className="card-header">Archive</h5>
            <div className="card-block">
              <form
                encType="multipart/form-data"
                onSubmit={props.handleArchiveSubmit}
              >
                <div className="row">
                  <div className="col">
                    <p>
                      {record.othernames} {record.surname}
                    </p>
                    <div className="form-group">
                      <label htmlFor="reason">Reason</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter reason"
                        id="reason"
                        onChange={props.handleArchiveReason}
                      />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={props.handleCloseArchive}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary ml-2 mr-3">
                    Save changes
                  </button>
                </div>
                <div className="text-primary text-center">
                  {props.isArchiveFetching
                    ? <div className="loader2" />
                    : <p className="mt-3">
                        {props.archiveMessage}
                      </p>}
                </div>
                <div className="text-danger text-center">
                  {props.errorMessage}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>;

export default class StaffRecordList extends Component {
  props: {
    staff_record: Array<any>,
    searchTerm: string,
    dispatch: Function,
    onModifyUserRecordSubmit: Function,
    onArchiveUserSubmit: Function,
    message: string,
    isFetching: boolean,
    isArchiveFetching: boolean,
    archiveMessage: string
  };

  state: {
    errorMessage: string,
    listID: string,
    dob: any,
    archiveReason: string,
    isEditing: boolean,
    isArchive: boolean,
    editReason: string
  };

  handleDateChange: Function;
  handleEditReason: Function;
  handleSubmit: Function;
  handleArchiveReason: Function;
  handleArchiveSubmit: Function;
  handleOpenEdit: Function;
  handleCloseEdit: Function;
  handleOpenArchive: Function;
  handleCloseArchive: Function;

  surname: HTMLInputElement;
  othernames: HTMLInputElement;
  designation: HTMLInputElement;
  email: HTMLInputElement;
  annual: HTMLInputElement;
  sick: HTMLInputElement;
  bereavement: HTMLInputElement;
  christmas: HTMLInputElement;
  gender: HTMLInputElement;
  dob: HTMLInputElement;
  maternity: HTMLInputElement;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      listID: '',
      dob: '',
      archiveReason: '',
      editReason: '',
      isEditing: false,
      isArchive: false
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEditReason = this.handleEditReason.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleArchiveReason = this.handleArchiveReason.bind(this);
    this.handleArchiveSubmit = this.handleArchiveSubmit.bind(this);
    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.handleOpenArchive = this.handleOpenArchive.bind(this);
    this.handleCloseArchive = this.handleCloseArchive.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange({ target }: SyntheticInputEvent) {
    this.props.dispatch(searchStaffRecord(target.value.toLowerCase()));
  }

  handleDateChange(e: Event) {
    this.setState({ dob: e });
  }

  handleEditReason({ target }: SyntheticInputEvent) {
    this.setState({ editReason: target.value });
  }

  handleOpenEdit(e: Event & { currentTarget: HTMLElement }) {
    this.setState({
      isEditing: !this.state.isEditing,
      listID: e.currentTarget.id
    });
  }

  handleCloseEdit() {
    const { dispatch } = this.props;

    this.setState({
      isEditing: !this.state.isEditing,
      errorMessage: '',
      dob: ''
    });

    if (this.state.editReason) {
      dispatch(fetchStaffRecord());
      dispatch({ type: 'CLEAR_MODIFY_USER_MESSAGE' });
    }
  }

  handleArchiveReason({ target }: SyntheticInputEvent) {
    this.setState({ archiveReason: target.value });
  }

  handleOpenArchive(e: Event & { currentTarget: HTMLElement }) {
    this.setState({
      isArchive: !this.state.isArchive,
      listID: e.currentTarget.id
    });
  }

  handleCloseArchive() {
    const { dispatch } = this.props;

    if (this.state.archiveReason) {
      dispatch(fetchStaffRecord());
      dispatch({ type: 'CLEAR_ARCHIVE_MESSAGE' });
    }

    this.setState({
      isArchive: !this.state.isArchive,
      errorMessage: '',
      dob: '',
      archiveReason: ''
    });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const id = this.state.listID;
    const surname = this.surname.value;
    const othernames = this.othernames.value;
    const staffEmail = this.email.value;
    const designation = this.designation.value;
    const annualDays = this.annual.value;
    const sickDays = this.sick.value;
    const bereavmentDays = this.bereavement.value;
    const christmasDays = this.christmas.value;
    const gender = this.gender.value;

    let dobDate = new Date(this.dob.value);
    let dob = moment(dobDate).format('MM DD YYYY');

    const dateOfBirth = this.state.dob
      ? moment(this.state.dob).format('MM DD YYYY')
      : dob;

    const mDays = gender => {
      if (gender.toLowerCase() === 'female') {
        return this.maternity.value ? this.maternity.value : 0;
      } else {
        return 0;
      }
    };
    const maternityDays = mDays(gender);

    const editReason = this.state.editReason
      ? this.state.editReason.trim()
      : null;

    // verify data
    if (
      !id ||
      !surname ||
      !othernames ||
      !staffEmail ||
      !designation ||
      !annualDays ||
      !sickDays ||
      !bereavmentDays ||
      !christmasDays ||
      !dateOfBirth ||
      !gender ||
      !editReason
    ) {
      this.setState({
        errorMessage: 'One or more required fields are missing!'
      });
      return null;
    }

    // prepare data to post to database
    const modifyUserDetails = {
      id: id,
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
      gender: gender,
      editReason: editReason
    };

    this.props.onModifyUserRecordSubmit(modifyUserDetails);
  }

  handleArchiveSubmit(e: Event) {
    e.preventDefault();
    const id = this.state.listID;
    const isArchived = true;
    const archiveReason = this.state.archiveReason;

    if (!id || !isArchived || !archiveReason) {
      this.setState({
        errorMessage: 'Reason field is mandatory!'
      });
      return null;
    }

    this.setState({ errorMessage: '' });

    const archiveUser = {
      id: id,
      isArchived: isArchived,
      archiveReason: archiveReason
    };

    this.props.onArchiveUserSubmit(archiveUser);
  }

  render() {
    const {
      staff_record,
      searchTerm,
      isFetching,
      message,
      isArchiveFetching,
      archiveMessage
    } = this.props;

    const listID = parseInt(this.state.listID, 10);

    if (this.state.isEditing) {
      return (
        <div>
          {staff_record.filter(e => e.id === listID).map(record => {
            let dob = new Date(record.date_of_birth);
            let dateOfBirth = moment(dob).format('DD/MM/YYYY');

            return (
              <div key={record.id}>
                <div className="col-md-6 offset-md-3 pb-2">
                  <div className="card">
                    <h5 className="card-header">Edit</h5>
                    <div className="card-block">
                      <form
                        encType="multipart/form-data"
                        onSubmit={this.handleSubmit}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="surName">Surname</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={record.surname}
                                ref={input => (this.surname = input)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="otherNames">Other Names</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={record.othernames}
                                ref={input => (this.othernames = input)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="staffEmail">Email address</label>
                          <input
                            type="email"
                            className="form-control"
                            defaultValue={record.email}
                            ref={input => (this.email = input)}
                          />
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="designation">Designation</label>
                              <select
                                className="form-control"
                                id="designation"
                                defaultValue={record.designation}
                                ref={select => (this.designation = select)}
                              >
                                <option>
                                  {record.designation}
                                </option>
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
                                id="designation"
                                defaultValue={record.gender}
                                ref={select => (this.gender = select)}
                              >
                                <option>
                                  {record.gender}
                                </option>
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
                                defaultValue={record.annual}
                                ref={input => (this.annual = input)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="sickLeave">Sick leave</label>
                              <input
                                type="number"
                                className="form-control"
                                defaultValue={record.sick}
                                ref={input => (this.sick = input)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="christmasLeave">
                                Christmas leave
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                defaultValue={record.christmas}
                                ref={input => (this.christmas = input)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="bereavementLeave">
                                Bereavement leave
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                defaultValue={record.bereavement}
                                ref={input => (this.bereavement = input)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          {record.gender.toLowerCase() === 'female' &&
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="Maternity leave">
                                  Maternity leave
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  defaultValue={record.maternity}
                                  ref={input => (this.maternity = input)}
                                />
                              </div>
                            </div>}
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="dob">Date of birth</label>
                              <input
                                type="hidden"
                                defaultValue={record.date_of_birth}
                                ref={input => (this.dob = input)}
                              />
                              <DatePicker
                                className="form-control"
                                dateFormat="DD/MM/YYYY"
                                openToDate={moment(dob)}
                                selected={this.state.dob}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                onChange={this.handleDateChange}
                                placeholderText={dateOfBirth}
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
                          {isFetching
                            ? <div className="loader2" />
                            : <p className="mt-3">
                                {message}
                              </p>}
                        </div>
                        <div className="text-danger text-center">
                          {this.state.errorMessage}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (this.state.isArchive) {
      return (
        <ArchiveUser
          staff_record={staff_record}
          listID={listID}
          handleArchiveSubmit={this.handleArchiveSubmit}
          handleArchiveReason={this.handleArchiveReason}
          handleCloseArchive={this.handleCloseArchive}
          isArchiveFetching={isArchiveFetching}
          archiveMessage={archiveMessage}
          errorMessage={this.state.errorMessage}
        />
      );
    }

    const filteredElements = staff_record
      .filter(
        e =>
          e.othernames.toLowerCase().includes(searchTerm) ||
          e.surname.toLowerCase().includes(searchTerm)
      )
      .map(record => {
        let dob = new Date(record.date_of_birth);
        let dateOfBirth = moment(dob).format('DD/MM/YYYY');

        return (
          <div className="col-md-3" key={record.id}>
            <div className="card mb-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <p className="h5">
                    {record.othernames} {record.surname}
                  </p>
                </li>
                <li className="list-group-item justify-content-between">
                  Annual
                  <span className="badge badge-primary badge-pill ">
                    {record.annual}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Sick
                  <span className="badge badge-primary badge-pill ">
                    {record.sick}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Bereavement
                  <span className="badge badge-primary badge-pill ">
                    {record.bereavement}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Christmas
                  <span className="badge badge-primary badge-pill ">
                    {record.christmas}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  DOB
                  <span className="badge badge-primary badge-pill ">
                    {dateOfBirth}
                  </span>
                </li>
                {record.gender.toLowerCase() === 'female' && record.maternity
                  ? <li className="list-group-item justify-content-between">
                      Maternity
                      <span className="badge badge-primary badge-pill ">
                        {record.maternity}
                      </span>
                    </li>
                  : <p className="list-group-item">
                      <br />
                    </p>}
                <li className="list-group-item">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={this.handleOpenEdit}
                    id={record.id}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-primary btn-sm ml-3"
                    onClick={this.handleOpenArchive}
                    id={record.id}
                  >
                    Archive
                  </button>
                </li>
              </ul>
            </div>
          </div>
        );
      });

    return (
      <div className="StaffRecordList">
        <Search handleSearchChange={this.handleSearchChange} />
        <div className="row">
          {filteredElements}
        </div>
      </div>
    );
  }
}
