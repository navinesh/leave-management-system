import React, { PropTypes, Component } from "react";

var DatePicker = require("react-datepicker");
require("react-datepicker/dist/react-datepicker.css");

const moment = require("moment");

var Loader = require("halogen/ClipLoader");

const PublicHolidays = props => (
  <div className="offset-md-1 col-md-10">
    <div className="card">
      <div className="card-block">
        <div className="row">
          <div className="col">
            <h4 className="card-title">Public Holidays</h4>
            <DeletePublicHolidays
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
                    <Loader color="#0275d8" size="20px" />
                  </div>
                : <p className="text-primary">
                    {props.addPublicMessage}
                  </p>}
              {props.isDeletePublicFetching
                ? <div className="text-center">
                    <Loader color="#0275d8" size="20px" />
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
  constructor() {
    super();
    this.state = { holidayDate: "", errorMessage: "" };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleDateChange(e) {
    this.setState({ holidayDate: e });
  }

  handleSubmit(e) {
    e.preventDefault();
    const holidayDate = this.state.holidayDate
      ? moment(this.state.holidayDate).format("MM DD YYYY")
      : null;

    if (!holidayDate) {
      this.setState({
        errorMessage: "You did not select any date!"
      });

      setTimeout(
        () => {
          this.setState({ errorMessage: "" });
        },
        5000
      );
      return null;
    }

    const publicHolidayDate = {
      holidayDate: holidayDate
    };
    this.props.onAddPublicHolidaySubmit(publicHolidayDate);
    this.setState({ holidayDate: "", errorMessage: "" });

    setTimeout(
      () => {
        this.props.dispatch({ type: "CLEAR_ADD_PUBLIC_MESSAGE" });
      },
      5000
    );
  }

  render() {
    return (
      <div>
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
          {this.state.errorMessage ? <div>{this.state.errorMessage}</div> : ""}
        </div>
      </div>
    );
  }
}

class DeletePublicHolidays extends Component {
  constructor() {
    super();
    this.state = { errorMessage: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const id = this.id.value ? this.id.value : null;

    if (!id) {
      this.setState({
        errorMessage: "Valid ID is required!"
      });

      setTimeout(
        () => {
          this.setState({ errorMessage: "" });
        },
        5000
      );
      return null;
    }

    const deletePublicHolidayDate = {
      id: id
    };
    this.props.onDeletePublicHolidaySubmit(deletePublicHolidayDate);
    this.setState({ id: "", errorMessage: "" });

    setTimeout(
      () => {
        this.props.dispatch({ type: "CLEAR_DELETE_PUBLIC_MESSAGE" });
      },
      5000
    );
  }

  render() {
    let list = this.props.public_holiday.sort((a, b) => {
      return b.id - a.id;
    });

    const public_holidays = list.map(item => {
      let hDate = new Date(item.holiday_date);
      let holiday_date = moment(hDate).format("dddd, Do MMMM YYYY");
      return (
        <li key={item.id}>
          {holiday_date}
          <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
            <input
              type="hidden"
              defaultValue={item.id}
              ref={input => this.id = input}
            />
            <button type="submit" className="btn btn-link btn-sm">
              <span className="text-danger">Delete</span>
            </button>
          </form>
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

PublicHolidays.propTypes = {
  public_holiday: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  onAddPublicHolidaySubmit: PropTypes.func.isRequired,
  onDeletePublicHolidaySubmit: PropTypes.func.isRequired,
  isAddPublicFetching: PropTypes.bool.isRequired,
  addPublicMessage: PropTypes.string,
  isDeletePublicFetching: PropTypes.bool.isRequired,
  deletePublicMessage: PropTypes.string
};

export default PublicHolidays;
