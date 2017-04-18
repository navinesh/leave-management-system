// @flow
import React, { Component } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const moment = require("moment");

const PublicHolidays = (
  props: {
    public_holiday: Array<any>,
    dispatch: Function,
    onAddPublicHolidaySubmit: Function,
    onDeletePublicHolidaySubmit: Function,
    isAddPublicFetching: boolean,
    addPublicMessage: string,
    isDeletePublicFetching: boolean,
    deletePublicMessage: string
  }
) => (
  <div className="offset-md-1 col-md-10">
    <div className="card">
      <div className="card-block">
        <div className="row">
          <div className="col">
            <h4 className="card-title">Public Holidays</h4>
            <DeletePublicHoliday
              public_holiday={props.public_holiday}
              dispatch={props.dispatch}
              onDeletePublicHolidaySubmit={props.onDeletePublicHolidaySubmit}
            />
          </div>
          <div className="col">
            <AddPublicHoliday
              dispatch={props.dispatch}
              onAddPublicHolidaySubmit={props.onAddPublicHolidaySubmit}
            />
            <div>
              {props.isAddPublicFetching
                ? <div className="text-center">
                    <div>Loading...</div>
                  </div>
                : <p className="text-primary">
                    {props.addPublicMessage}
                  </p>}
              {props.isDeletePublicFetching
                ? <div className="text-center">
                    <div>Loading...</div>
                  </div>
                : <p className="text-primary">
                    {props.deletePublicMessage}
                  </p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

class AddPublicHoliday extends Component {
  state: { holidayDate: string, errorMessage: string };

  handleDateChange: Function;
  handleSubmit: Function;

  constructor() {
    super();
    this.state = { holidayDate: "", errorMessage: "" };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleDateChange(e: Event) {
    this.setState({ holidayDate: e });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const holidayDate = this.state.holidayDate
      ? moment(this.state.holidayDate).format("MM DD YYYY")
      : null;

    if (!holidayDate) {
      this.setState({
        errorMessage: "You did not select any date!"
      });

      setTimeout(() => {
        this.setState({ errorMessage: "" });
      }, 5000);
      return null;
    }

    const publicHolidayDate = {
      holidayDate: holidayDate
    };

    this.props.onAddPublicHolidaySubmit(publicHolidayDate);
    this.setState({ holidayDate: "", errorMessage: "" });

    setTimeout(() => {
      this.props.dispatch({ type: "CLEAR_ADD_PUBLIC_MESSAGE" });
    }, 5000);
  }

  render() {
    return (
      <div className="AddPublicHoliday">
        <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <DatePicker
              className="form-control"
              dateFormat="DD/MM/YYYY"
              selected={this.state.holidayDate}
              onChange={this.handleDateChange}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Click to select a date"
            />
            <button type="submit" className="btn btn-primary btn-sm ml-3">
              Add
            </button>
          </div>
        </form>
        <div className="text-danger">
          <div>{this.state.errorMessage}</div>
        </div>
      </div>
    );
  }
}

class DeletePublicHoliday extends Component {
  state: { errorMessage: string };

  handleDelete: Function;

  constructor() {
    super();
    this.state = { errorMessage: "" };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(e: Event) {
    e.preventDefault();
    const id = e.target.id ? e.target.id : null;

    if (!id) {
      this.setState({
        errorMessage: "Valid ID is required!"
      });

      setTimeout(() => {
        this.setState({ errorMessage: "" });
      }, 5000);
      return null;
    }

    const deletePublicHolidayDate = {
      id: id
    };

    this.props.onDeletePublicHolidaySubmit(deletePublicHolidayDate);
    this.setState({ id: "", errorMessage: "" });

    setTimeout(() => {
      this.props.dispatch({ type: "CLEAR_DELETE_PUBLIC_MESSAGE" });
    }, 5000);
  }

  render() {
    let list = this.props.public_holiday.sort((a, b) => {
      return new Date(a.holiday_date) - new Date(b.holiday_date);
    });

    const public_holidays = list.map(item => {
      let hDate = new Date(item.holiday_date);
      let holiday_date = moment(hDate).format("dddd, Do MMMM YYYY");
      return (
        <li key={item.id}>
          {holiday_date}
          <button
            className="btn btn-link btn-sm text-danger"
            onClick={this.handleDelete}
            id={item.id}
          >
            Delete
          </button>
        </li>
      );
    });
    return (
      <div className="DeletePublicHolidays">
        <ul>{public_holidays}</ul>
        <div className="text-danger">
          {this.state.errorMessage ? <div>{this.state.errorMessage}</div> : ""}
        </div>
      </div>
    );
  }
}

export default PublicHolidays;
