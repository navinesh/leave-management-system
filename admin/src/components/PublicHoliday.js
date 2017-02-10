import React, { PropTypes, Component } from "react";

var DatePicker = require("react-datepicker");
require("react-datepicker/dist/react-datepicker.css");

const moment = require("moment");

var Loader = require("halogen/ClipLoader");

class PublicHolidays extends Component {
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
        this.props.dispatch({ type: "CLEAR_PUBLIC_MESSAGE" });
      },
      8000
    );
  }

  render() {
    return (
      <div className="offset-md-2 col-md-8">
        <div className="card">
          <div className="card-block">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Public Holidays</h4>
                <PublicHolidayList
                  public_holiday={this.props.public_holiday}
                  isPublicFetching={this.props.isPublicFetching}
                  publicMessage={this.props.publicMessage}
                  errorMessage={this.state.errorMessage}
                />
              </div>
              <div className="col-md-6">
                <AddPublicHoliday
                  holidayDate={this.state.holidayDate}
                  handleDateChange={this.handleDateChange}
                  handleSubmit={this.handleSubmit}
                />
                <div>
                  {this.props.isPublicFetching
                    ? <div className="text-center">
                        <Loader color="#0275d8" size="20px" />
                      </div>
                    : <p className="text-primary">
                        {this.props.publicMessage}
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

const PublicHolidayList = props => {
  const public_holidays = props.public_holiday.map(item => {
    let hDate = new Date(item.holiday_date);
    let holiday_date = moment(hDate).format("dddd, Do MMMM YYYY");
    return <li key={item.id}>{holiday_date}</li>;
  });

  return <ul>{public_holidays}</ul>;
};

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
  isPublicFetching: PropTypes.bool.isRequired,
  publicMessage: PropTypes.string
};

export default PublicHolidays;
