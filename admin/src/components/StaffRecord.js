import React, { PropTypes, Component } from "react";
import { fetchStaffRecord, searchStaffRecord } from "../actions/StaffRecord";

import Modal from "react-modal";

var DatePicker = require("react-datepicker");
require("react-datepicker/dist/react-datepicker.css");

const moment = require("moment");

var Loader = require("halogen/ClipLoader");

const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)"
  },
  content: {
    position: "absolute",
    top: "40px",
    left: "0px",
    right: "0px",
    bottom: "0px",
    border: "0",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    outline: "none"
  }
};

class StaffRecordList extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: "",
      listID: "",
      dob: "",
      showModal1: false,
      showModal2: false
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpenModal1 = this.handleOpenModal1.bind(this);
    this.handleCloseModal1 = this.handleCloseModal1.bind(this);
    this.handleOpenModal2 = this.handleOpenModal2.bind(this);
    this.handleCloseModal2 = this.handleCloseModal2.bind(this);
  }

  handleSearchChange(e) {
    this.props.dispatch(searchStaffRecord(e.target.value.toLowerCase()));
  }

  handleDateChange(e) {
    this.setState({ dob: e });
  }

  handleOpenModal1(e) {
    this.setState({ showModal1: true });
    this.setState({ listID: e.target.id });
  }

  handleOpenModal2(e) {
    this.setState({ showModal2: true });
    this.setState({ listID: e.target.id });
  }

  handleCloseModal1() {
    this.setState({ showModal1: false, errorMessage: "", dob: "" });
  }

  handleCloseModal2() {
    this.setState({ showModal2: false, errorMessage: "", dob: "" });
  }

  handleSubmit(e) {
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
    this.props.dispatch(fetchStaffRecord());
  }

  render() {
    const { staff_record, searchTerm, isFetching, message } = this.props;
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
                {
                  record.gender.toLowerCase() === "female"
                    ? <li className="list-group-item justify-content-between">
                      Maternity
                      <span className="badge badge-primary badge-pill ">
                        {record.maternity}
                      </span>
                    </li>
                    : <p className="list-group-item"><br /></p>
                }
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
          {staff_record
            .filter(e => e.id === listID)
            .map(record => {
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
                            {
                              record.gender.toLowerCase() === "female"
                                ? <div className="col-md-6">
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
                                </div>
                                : <br />
                            }
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
                            <button
                              type="submit"
                              className="btn btn-primary col"
                            >
                              Save changes
                            </button>
                          </div>
                        </div>
                      </form>
                      <div className="text-primary text-center bp-2">
                        {
                          isFetching
                            ? <Loader color="#0275d8" size="20px" />
                            : <p className="h5">{message}</p>
                        }
                      </div>
                      <div className="text-danger text-center pb-4">
                        {
                          this.state.errorMessage
                            ? <div>{this.state.errorMessage}</div>
                            : ""
                        }
                      </div>
                    </div>
                  </Modal>
                </div>
              );
            })}
          {staff_record
            .filter(e => e.id === listID)
            .map(record => (
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
                    <div className="modal-body">
                      <p>Modal #2 text!</p>
                      {record.id}
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-outline-primary"
                        onClick={this.handleCloseModal2}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save changes
                      </button>
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

StaffRecordList.propTypes = {
  staff_record: PropTypes.array.isRequired,
  searchTerm: React.PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  onModifyUserRecordSubmit: PropTypes.func.isRequired,
  message: PropTypes.string,
  isFetching: PropTypes.bool.isRequired
};

export default StaffRecordList;
