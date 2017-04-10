// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";

import { searchStaffRecord } from "../actions/StaffRecord";
import { fetchArchivedStaffRecord } from "../actions/ArchivedStaffRecord";

const moment = require("moment");
import Modal from "react-modal";
var Loader = require("halogen/ClipLoader");

import customStyles from "../Styles";

class ArchivedStaffRecordList extends Component {
  state: {
    errorMessage: string,
    showModal: boolean,
    listID: string
  };

  handleSearchChange: Function;
  handleOpenModal: Function;
  handleCloseModal: Function;
  handleSubmit: Function;

  constructor() {
    super();
    this.state = {
      errorMessage: "",
      listID: "",
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSearchChange({ target }: SyntheticInputEvent) {
    this.props.dispatch(searchStaffRecord(target.value.toLowerCase()));
  }

  handleOpenModal(e: Event & { currentTarget: HTMLElement }) {
    this.setState({ showModal: true, listID: e.currentTarget.id });
  }

  handleCloseModal(e: Event) {
    const { dispatch } = this.props;

    this.setState({ showModal: false, errorMessage: "" });
    dispatch(fetchArchivedStaffRecord());
    dispatch({ type: "CLEAR_UNARCHIVE_MESSAGE" });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const id = this.state.listID;
    const isArchived = false;

    if (!id) {
      this.setState({
        errorMessage: "Could not fetch ID!"
      });
      return null;
    }

    const unArchiveUser = {
      id: id,
      isArchived: isArchived
    };

    this.props.onUnArchiveUserSubmit(unArchiveUser);
  }

  render() {
    const { archived_staff_record, searchTerm } = this.props;
    const listID = parseInt(this.state.listID, 10);

    const filteredElements = archived_staff_record
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
                  <span className="badge badge-primary badge-pill">
                    {record.annual}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Sick
                  <span className="badge badge-primary badge-pill">
                    {record.sick}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Bereavement
                  <span className="badge badge-primary badge-pill">
                    {record.bereavement}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Christmas
                  <span className="badge badge-primary badge-pill">
                    {record.christmas}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  DOB
                  <span className="badge badge-primary badge-pill">
                    {dateOfBirth}
                  </span>
                </li>
                {record.gender.toLowerCase() === "female"
                  ? <li className="list-group-item justify-content-between">
                      Maternity
                      <span className="badge badge-primary badge-pill">
                        {record.maternity}
                      </span>
                    </li>
                  : <p className="list-group-item"><br /></p>}
                <li className="list-group-item">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={this.handleOpenModal}
                    id={record.id}
                  >
                    Unarchive
                  </button>
                </li>
              </ul>
            </div>
          </div>
        );
      });

    return (
      <div className="ArchivedStaffRecordList">
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
          {archived_staff_record.filter(e => e.id === listID).map(record => (
            <div key={record.id}>
              <Modal
                className="Modal__Bootstrap modal-dialog"
                isOpen={this.state.showModal}
                onRequestClose={this.handleCloseModal}
                contentLabel="Modal #1"
                overlayClassName="Overlay"
                style={customStyles}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Unarchive
                    </h5>
                  </div>
                  <form
                    encType="multipart/form-data"
                    onSubmit={this.handleSubmit}
                  >
                    <div className="modal-body">
                      <p>
                        Are you sure you want to unarchive{" "}
                        <span className="h5">
                          {record.othernames}
                          {" "}
                          {record.surname}
                        </span>
                        ?
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={this.handleCloseModal}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Yes
                      </button>
                    </div>
                  </form>
                  <div className="text-primary text-center">
                    {this.props.isUnArchiveFetching
                      ? <Loader color="#0275d8" size="20px" />
                      : <p className="lead pb-2">
                          {this.props.unArchiveMessage}
                        </p>}
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

ArchivedStaffRecordList.propTypes = {
  archived_staff_record: PropTypes.array.isRequired,
  searchTerm: React.PropTypes.string,
  onUnArchiveUserSubmit: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  isUnArchiveFetching: PropTypes.bool,
  unArchiveMessage: PropTypes.string
};

export default ArchivedStaffRecordList;
