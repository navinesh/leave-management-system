import React, { PropTypes, Component } from "react";

var DatePicker = require("react-datepicker");
require("react-datepicker/dist/react-datepicker.css");

const moment = require("moment");

var Loader = require("halogen/ClipLoader");

class PublicHolidays extends Component {
  constructor() {
    super();
    this.state = { holidayDate: "", errorMessage: "", id: "" };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
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
        8000
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
      8000
    );
  }

  handleDeleteSubmit(e) {
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
        8000
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
      8000
    );
  }

  render() {
    var list = this.props.public_holiday.sort(function(a, b) {
      return b.id - a.id;
    });

    const public_holidays = list.map(item => {
      let hDate = new Date(item.holiday_date);
      let holiday_date = moment(hDate).format("dddd, Do MMMM YYYY");
      return (
        <li key={item.id}>
          {holiday_date}
          <form
            encType="multipart/form-data"
            onSubmit={this.handleDeleteSubmit}
          >
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
      <div className="offset-md-1 col-md-10">
        <div className="card">
          <div className="card-block">
            <div className="row">
              <div className="col">
                <h4 className="card-title">Public Holidays</h4>
                <ul>{public_holidays}</ul>
              </div>
              <div className="col">
                <AddPublicHoliday
                  holidayDate={this.state.holidayDate}
                  handleDateChange={this.handleDateChange}
                  handleSubmit={this.handleSubmit}
                />
                <div>
                  {this.props.isAddPublicFetching
                    ? <div className="text-center">
                        <Loader color="#0275d8" size="20px" />
                      </div>
                    : <p className="text-primary">
                        {this.props.addPublicMessage}
                      </p>}
                  {this.props.isDeletePublicFetching
                    ? <div className="text-center">
                        <Loader color="#0275d8" size="20px" />
                      </div>
                    : <p className="text-primary">
                        {this.props.deletePublicMessage}
                      </p>}
                </div>
                <div className="text-danger">
                  {this.state.errorMessage
                    ? <div>{this.state.errorMessage}</div>
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const AddPublicHoliday = props => (
  <form encType="multipart/form-data" onSubmit={props.handleSubmit}>
    <div className="form-group">
      <DatePicker
        className="form-control"
        dateFormat="DD/MM/YYYY"
        selected={props.holidayDate}
        onChange={props.handleDateChange}
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
);

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
