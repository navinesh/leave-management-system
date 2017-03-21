import React, { PropTypes, Component } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";

var DatePicker = require("react-datepicker");
require("react-datepicker/dist/react-datepicker.css");

import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

var Loader = require("halogen/ClipLoader");

import customStyles from "../Styles";

class ApprovedLeaveList extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      editReason: null,
      deleteReason: null,
      showModal1: false
    };
    this.handleOpenModal1 = this.handleOpenModal1.bind(this);
    this.handleCloseModal1 = this.handleCloseModal1.bind(this);
  }

  handleOpenModal1(e) {
    this.setState({ showModal1: true, listID: e.target.id });
  }

  handleCloseModal1() {
    this.setState({ showModal1: false, errorMessage: null });
    if (this.state.editReason) {
      this.props.dispatch(this.props.fetchApprovedLeave());
    }
  }

  render() {
    const { approved_items } = this.props;
    const listID = parseInt(this.state.listID, 10);

    const items = approved_items
      .filter(record => {
        // get current date and format it
        let dateToday = moment();

        let todayDate = dateToday.format("DD/MM/YYYY");

        // get end date and format it
        let end_Date = moment(record.end_date, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        );

        // check if current date and end date is same
        let isCurrentDate = todayDate === end_Date ? true : false;

        // check if end date is same or greater than current date
        let eDate = moment(record.end_date, "DD/MM/YYYY").format("MM/DD/YYYY");

        let endDate = moment(new Date(eDate));

        let isEndDate = endDate.isSameOrAfter(dateToday);

        // return true for current and future leaves
        return isCurrentDate || isEndDate ? true : false;
      })
      .map(data => (
        <tr key={data.id}>
          <td>{data.user.othernames}{" "}{data.user.surname}</td>
          <td>{data.leave_name}</td>
          <td>{data.leave_type}</td>
          <td>{data.start_date}</td>
          <td>{data.end_date}</td>
          <td>{data.leave_days}</td>
          <td>
            <button
              className="btn btn-link text-primary"
              onClick={this.handleOpenModal1}
              id={data.id}
            >
              Edit
            </button>
          </td>
          <td>
            <Link to="/reset" className="btn btn-link text-danger">
              Delete
            </Link>
          </td>
        </tr>
      ));

    return items.length > 0
      ? <div>
          <div className="table-responsive">
            <table
              className="table table-bordered table-hover"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <thead className="thead-default">
                <tr>
                  <th>Name</th>
                  <th>Leave</th>
                  <th>Type</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Leave days</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </table>
          </div>
          {approved_items.filter(e => e.id === listID).map(record => (
            <div key={record.id}>
              <Modal
                className="Modal__Bootstrap modal-dialog"
                isOpen={this.state.showModal1}
                onRequestClose={this.handleCloseModal1}
                contentLabel="Modal #1"
                overlayClassName="Overlay"
                style={customStyles}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Edit
                    </h5>
                  </div>
                  <form
                    encType="multipart/form-data"
                    onSubmit={this.handleEditSubmit}
                  >
                    <div className="modal-body">
                      <div className="row">
                        <div className="col">
                          <p className="h5">
                            {record.user.othernames}{" "}{record.user.surname}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="leave">
                              Leave
                            </label>
                            <select
                              className="form-control"
                              id="leave"
                              defaultValue={record.leave_name}
                              ref={select => this.leave_name = select}
                            >
                              <option>{record.leave_name}</option>
                              <option>annual</option>
                              <option>sick</option>
                              <option>bereavement</option>
                              <option>christmas</option>
                              <option>birthday</option>
                              {record.user.gender === "female"
                                ? <option>maternity</option>
                                : null}
                              <option>lwop</option>
                              <option>other</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="leave type">Leave type</label>
                            <select
                              className="form-control"
                              id="leave type"
                              defaultValue={record.leave_type}
                              ref={select => this.leave_type = select}
                            >
                              <option>{record.leave_type}</option>
                              <option>full</option>
                              <option>half day am</option>
                              <option>half day pm</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="startDate">Start date</label>
                            <input
                              type="hidden"
                              defaultValue={record.start_date}
                              ref={input => this.startDate = input}
                            />
                            <DatePicker
                              className="form-control"
                              placeholderText="Click to select a date"
                              selected={this.state.startDate}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              onChange={this.handleStartDateChange}
                              showMonthDropdown
                              dropdownMode="select"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="endDate">End date</label>
                            <input
                              type="hidden"
                              defaultValue={record.end_date}
                              ref={input => this.endDate = input}
                            />
                            <DatePicker
                              className="form-control"
                              placeholderText="Click to select a date"
                              selected={this.state.endDate}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              onChange={this.handleEndDateChange}
                              showMonthDropdown
                              dropdownMode="select"
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
                  <div className="text-primary text-center">
                    {this.props.isEditLeaveFetching
                      ? <Loader color="#0275d8" size="20px" />
                      : <p className="lead pb-2">
                          {this.props.editLeaveMessage}
                        </p>}
                  </div>
                  <div className="text-danger text-center">
                    <div className="pb-5">{this.state.errorMessage}</div>
                  </div>
                </div>
              </Modal>
            </div>
          ))}
        </div>
      : <div className="container text-center" style={{ paddingTop: "100px" }}>
          <h1 className="display-4">There are no approved leave record.</h1>
        </div>;
  }
}

ApprovedLeaveList.propTypes = {
  approved_items: PropTypes.array.isRequired,
  fetchApprovedLeave: PropTypes.func.isRequired
};

export default ApprovedLeaveList;
