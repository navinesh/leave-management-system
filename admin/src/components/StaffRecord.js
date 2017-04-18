// @flow
import React, { Component } from "react";

import { searchStaffRecord, fetchStaffRecord } from "../actions/StaffRecord";

import Modal from "react-modal";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const moment = require("moment");

import customStyles from "../Styles";

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
    showModal1: boolean,
    showModal2: boolean
  };

  handleDateChange: Function;
  handleSubmit: Function;
  handleArchiveReason: Function;
  handleArchiveSubmit: Function;
  handleOpenModal1: Function;
  handleCloseModal1: Function;
  handleOpenModal2: Function;
  handleCloseModal2: Function;

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
      errorMessage: "",
      listID: "",
      dob: "",
      archiveReason: "",
      showModal1: false,
      showModal2: false
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleArchiveReason = this.handleArchiveReason.bind(this);
    this.handleArchiveSubmit = this.handleArchiveSubmit.bind(this);
    this.handleOpenModal1 = this.handleOpenModal1.bind(this);
    this.handleCloseModal1 = this.handleCloseModal1.bind(this);
    this.handleOpenModal2 = this.handleOpenModal2.bind(this);
    this.handleCloseModal2 = this.handleCloseModal2.bind(this);
  }

  handleSearchChange({ target }: SyntheticInputEvent) {
    this.props.dispatch(searchStaffRecord(target.value.toLowerCase()));
  }

  handleDateChange(e: Event) {
    this.setState({ dob: e });
  }

  handleArchiveReason({ target }: SyntheticInputEvent) {
    this.setState({ archiveReason: target.value });
  }

  handleOpenModal1(e: Event & { currentTarget: HTMLElement }) {
    this.setState({ showModal1: true, listID: e.currentTarget.id });
  }

  handleOpenModal2(e: Event & { currentTarget: HTMLElement }) {
    this.setState({ showModal2: true, listID: e.currentTarget.id });
  }

  handleCloseModal1() {
    this.setState({ showModal1: false, errorMessage: "", dob: "" });
    this.props.dispatch({ type: "CLEAR_MODIFY_USER_MESSAGE" });
  }

  handleCloseModal2() {
    if (this.state.archiveReason) {
      this.props.dispatch(fetchStaffRecord());
      this.props.dispatch({ type: "CLEAR_ARCHIVE_MESSAGE" });
    }

    this.setState({
      showModal2: false,
      errorMessage: "",
      dob: "",
      archiveReason: ""
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
    let dob = moment(dobDate).format("MM DD YYYY");

    const dateOfBirth = this.state.dob
      ? moment(this.state.dob).format("MM DD YYYY")
      : dob;

    const mDays = gender => {
      if (gender.toLowerCase() === "female") {
        return this.maternity.value ? this.maternity.value : 0;
      } else {
        return 0;
      }
    };
    const maternityDays = mDays(gender);

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
      !gender
    ) {
      this.setState({
        errorMessage: "One or more required fields are missing!"
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
      gender: gender
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
        errorMessage: "One or more required fields are missing!"
      });
      return null;
    }

    this.setState({ errorMessage: "" });

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

    const filteredElements = staff_record
      .filter(
        e =>
          e.othernames.toLowerCase().includes(searchTerm) ||
          e.surname.toLowerCase().includes(searchTerm)
      )
      .map(record => {
        let dob = new Date(record.date_of_birth);
        let dateOfBirth = moment(dob).format("DD/MM/YYYY");

        return (
          <div className="col-md-3" key={record.id}>
            <div className="card mb-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <p className="h5">{record.othernames}{" "}{record.surname}</p>
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
                {record.gender.toLowerCase() === "female"
                  ? <li className="list-group-item justify-content-between">
                      Maternity
                      <span className="badge badge-primary badge-pill ">
                        {record.maternity}
                      </span>
                    </li>
                  : <p className="list-group-item"><br /></p>}
                <li className="list-group-item">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={this.handleOpenModal1}
                    id={record.id}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary btn-sm ml-3"
                    onClick={this.handleOpenModal2}
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
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                onChange={this.handleSearchChange.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          {filteredElements}
          {staff_record.filter(e => e.id === listID).map(record => {
            let dob = new Date(record.date_of_birth);
            let dateOfBirth = moment(dob).format("DD/MM/YYYY");

            return (
              <div key={record.id}>
                <Modal
                  className="Modal__Bootstrap modal-dialog"
                  isOpen={this.state.showModal1}
                  onRequestClose={this.handleCloseModal1}
                  overlayClassName="Overlay"
                  contentLabel="Modal 1"
                  style={customStyles}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="editModalLabel">
                        Edit
                      </h5>
                    </div>
                    <form
                      encType="multipart/form-data"
                      onSubmit={this.handleSubmit}
                    >
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="surName">Surname</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={record.surname}
                                ref={input => this.surname = input}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="otherNames">
                                Other Names
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={record.othernames}
                                ref={input => this.othernames = input}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="staffEmail">
                            Email address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            defaultValue={record.email}
                            ref={input => this.email = input}
                          />
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="designation">
                                Designation
                              </label>
                              <select
                                className="form-control"
                                id="designation"
                                defaultValue={record.designation}
                                ref={select => this.designation = select}
                              >
                                <option>{record.designation}</option>
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
                                id="designation"
                                defaultValue={record.gender}
                                ref={select => this.gender = select}
                              >
                                <option>{record.gender}</option>
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
                              <label htmlFor="annualLeave">
                                Annual leave
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                defaultValue={record.annual}
                                ref={input => this.annual = input}
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
                                ref={input => this.sick = input}
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
                                ref={input => this.christmas = input}
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
                                ref={input => this.bereavement = input}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          {record.gender.toLowerCase() === "female" &&
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="Maternity leave">
                                  Maternity leave
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  defaultValue={record.maternity}
                                  ref={input => this.maternity = input}
                                />
                              </div>
                            </div>}
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="dob">Date of birth</label>
                              <input
                                type="hidden"
                                defaultValue={record.date_of_birth}
                                ref={input => this.dob = input}
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
                      </div>
                      <div className="modal-footer">
                        <div className="form-group">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={this.handleCloseModal1}
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
                    <div className=" text-center bp-2">
                      {isFetching
                        ? <div>Loading...</div>
                        : <p className="lead">{message}</p>}
                    </div>
                    <div className="text-danger text-center pb-4">
                      <div>{this.state.errorMessage}</div>
                    </div>
                  </div>
                </Modal>
              </div>
            );
          })}
          {staff_record.filter(e => e.id === listID).map(record => (
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
                      Archive
                    </h5>
                  </div>
                  <form
                    encType="multipart/form-data"
                    onSubmit={this.handleArchiveSubmit}
                  >
                    <div className="modal-body">
                      <p>{record.othernames}{" "}{record.surname}</p>
                      <div className="form-group">
                        <label htmlFor="reason">Reason</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter reason"
                          id="reason"
                          onChange={this.handleArchiveReason}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={this.handleCloseModal2}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save changes
                      </button>
                    </div>
                  </form>
                  <div className="text-primary text-center">
                    {isArchiveFetching
                      ? <div>Loading...</div>
                      : <p className="lead pb-2">{archiveMessage}</p>}
                  </div>
                  <div className="text-danger text-center">
                    <div className="pb-4">{this.state.errorMessage}</div>
                  </div>
                </div>
              </Modal>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
