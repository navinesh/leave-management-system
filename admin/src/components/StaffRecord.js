import React, { PropTypes, Component } from "react";
import { searchStaffRecord } from "../actions/StaffRecord";
import Modal from "react-modal";

const moment = require("moment");

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
    top: "60px",
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
      successMessage: "",
      showModal1: false,
      showModal2: false
    };
    this.handleSurnameChange = this.handleSurnameChange.bind(this);
    this.handleOtherNamesChange = this.handleOtherNamesChange.bind(this);
    this.handleStaffEmailChange = this.handleStaffEmailChange.bind(this);
    this.handleDesignationChange = this.handleDesignationChange.bind(this);
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

    this.handleOpenModal1 = this.handleOpenModal1.bind(this);
    this.handleCloseModal1 = this.handleCloseModal1.bind(this);
    this.handleOpenModal2 = this.handleOpenModal2.bind(this);
    this.handleCloseModal2 = this.handleCloseModal2.bind(this);
  }

  handleSearchChange(e) {
    this.props.dispatch(searchStaffRecord(e.target.value.toLowerCase()));
  }

  handleSurnameChange(e) {
    this.setState({ surname: e.target.value });
  }

  handleOtherNamesChange(e) {
    this.setState({ otherNames: e.target.value });
  }

  handleStaffEmailChange(e) {
    this.setState({ staffEmail: e });
  }

  handleDesignationChange(e) {
    this.setState({ designation: e });
  }

  handleDOBChange(e) {
    this.setState({ dob: e.target.value });
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

  handlegenderChange(e) {
    this.setState({ gender: e.target.value });
  }

  handleOpenModal1(e) {
    this.setState({ showModal1: true });
    this.setState({ showModal2: false });
    this.setState({ listID: e.target.id });
  }

  handleOpenModal2(e) {
    this.setState({ showModal2: true });
    this.setState({ showModal1: false });
    this.setState({ listID: e.target.id });
  }

  handleCloseModal1() {
    this.setState({ showModal1: false });
  }

  handleCloseModal2() {
    this.setState({ showModal2: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    const surname = this.state.surname;
    const othernames = this.state.otherNames;
    const staffEmail = this.state.staffEmail;
    const designation = this.state.designation;
    const annualDays = this.state.annualLeave;
    const sickDays = this.state.sickLeave;
    const bereavmentDays = this.state.bereavementLeave;
    const christmasDays = this.state.christmasLeave;
    const dateOfBirth = this.state.dob;
    const maternityDays = this.state.maternityLeave
      ? this.state.maternityLeave
      : null;
    const gender = this.state.gender;
    // verify data
    if (
      !surname || !othernames || !staffEmail || !designation || !annualDays ||
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
    const editUserDetails = {
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
    this.props.onEditUserRecordSubmit(editUserDetails);
  }

  render() {
    const { staff_record, searchTerm } = this.props;
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
            <div className="card card-block mb-2">
              <ul className="list-unstyled">
                <li className="h5">
                  {record.othernames}{" "}{record.surname}
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">
                    {record.annual}
                  </span>
                  Annual
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">
                    {record.sick}
                  </span>
                  Sick
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">
                    {record.bereavement}
                  </span>
                  Bereavement
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">
                    {record.christmas}
                  </span>
                  Christmas
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">
                    {dateOfBirth}
                  </span>
                  DOB
                </li>
                <li>
                  <span className="badge badge-primary badge-pill float-right">
                    {record.maternity}
                  </span>
                  Maternity
                </li>
                <li className="mt-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={this.handleOpenModal1}
                    id={record.id}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm ml-2"
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
              .map(
                record => (
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
                        <div className="modal-body">
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
                                    placeholder={record.othernames}
                                    id="surName"
                                    onChange={this.handleOtherNamesChange}
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
                                    placeholder={record.surname}
                                    id="otherNames"
                                    onChange={this.handleSurnameChange}
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
                                placeholder={record.email}
                                id="staffEmail"
                                onChange={this.handleStaffEmailChange}
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
                                    onChange={this.handleDesignationChange}
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
                                    onChange={this.handlegenderChange}
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
                                    placeholder={record.annual}
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
                                    placeholder={record.sick}
                                    id="sickLeave"
                                    onChange={this.handleSickLeaveChange}
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
                                    placeholder={record.christmas}
                                    id="christmasLeave"
                                    onChange={this.handleChristmasLeaveChange}
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
                                    placeholder={record.bereavement}
                                    id="bereavementLeave"
                                    onChange={this.handleBereavementLeaveChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Maternity leave">
                                    Maternity leave
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder={record.maternity}
                                    id="maternityLeave"
                                    onChange={this.handleMaternityLeaveChange}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label htmlFor="dob">Date of birth</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="{dateOfBirth}"
                                    id="dob"
                                    onChange={this.handleDOBChange}
                                  />
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
                        </div>
                      </div>
                    </Modal>
                  </div>
                )
              )}
          {staff_record
              .filter(e => e.id === listID)
              .map(
                record => (
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
                )
              )}
        </div>
      </div>
    );
  }
}

StaffRecordList.propTypes = {
  staff_record: PropTypes.array.isRequired,
  searchTerm: React.PropTypes.string,
  //onEditUserRecordSubmit: PropTypes.func.isRequired
  dispatch: PropTypes.func.isRequired
};

export default StaffRecordList;
