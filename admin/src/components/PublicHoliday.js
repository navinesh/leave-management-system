// @flow
import React, { Component } from 'react';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const moment = require('moment');

type addPublicHolidayProps = {
  addHoliday: Function
};

type addPublicHolidayState = {
  date: any,
  focused: any,
  holidayDate: any,
  successMessage: string,
  errorMessage: string
};

class AddPublicHoliday extends Component<
  addPublicHolidayProps,
  addPublicHolidayState
> {
  handleSubmit: Function;
  onDateChange: Function;
  onFocusChange: Function;

  constructor() {
    super();
    this.state = {
      date: null,
      focused: false,
      holidayDate: null,
      successMessage: '',
      errorMessage: ''
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onDateChange(e: Event) {
    this.setState({ date: e });
  }

  onFocusChange(e: Event & { focused: HTMLElement }) {
    this.setState({ focused: e.focused });
  }

  handleSubmit(e: Event) {
    e.preventDefault();

    const holidayDate = this.state.date
      ? moment(this.state.date).format('MM DD YYYY')
      : null;

    if (!holidayDate) {
      this.setState({
        errorMessage: 'You did not select any date!'
      });

      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 3000);
      return null;
    }

    this.props.addHoliday(holidayDate);

    this.setState({ date: null, holidayDate: '' });
  }

  render() {
    return (
      <div className="AddPublicHoliday">
        <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <SingleDatePicker
              date={this.state.date}
              onDateChange={this.onDateChange}
              focused={this.state.focused}
              onFocusChange={this.onFocusChange}
              numberOfMonths={1}
              isOutsideRange={() => false}
              showClearDate
              //withPortal
            />
            <button type="submit" className="btn btn-primary ml-3">
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

type deletePublicHolidayProps = {
  public_holiday: Object,
  deleteHoliday: Function
};

type deletePublicHolidayState = {
  errorMessage: string
};

class DeletePublicHoliday extends Component<
  deletePublicHolidayProps,
  deletePublicHolidayState
> {
  handleDelete: Function;

  constructor() {
    super();
    this.state = { errorMessage: '' };

    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete({ target }: SyntheticInputEvent<>) {
    const id = target.value;

    if (!id) {
      this.setState({
        errorMessage: 'Valid id is required!'
      });

      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 3000);
      return null;
    }

    this.props.deleteHoliday(id);

    this.setState({ errorMessage: '' });
  }

  render() {
    let list = this.props.public_holiday.edges.map(a => a.node).sort((b, c) => {
      return new Date(b.holidayDate) - new Date(c.holidayDate);
    });

    const public_holidays = list.map(item => {
      let hDate = new Date(item.holidayDate);
      let holiday_date = moment(hDate).format('dddd, Do MMMM YYYY');
      return (
        <li key={item.id}>
          {holiday_date}
          <button
            className="btn btn-link btn-sm text-danger"
            value={item.id}
            onClick={this.handleDelete}
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
          <div>{this.state.errorMessage}</div>
        </div>
      </div>
    );
  }
}

type publicHolidayProps = {
  publicHolidays: Object,
  addHoliday: Function,
  deleteHoliday: Function
};

export default (props: publicHolidayProps) => {
  const {
    publicHolidays: { loading, error, publicHoliday },
    addHoliday,
    deleteHoliday
  } = props;

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <div className="loader1" />
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error.message);
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <p>Something went wrong!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4>Public Holidays</h4>
      </div>
      <div className=" card-body">
        <div className="row">
          <div className="col">
            <DeletePublicHoliday
              public_holiday={publicHoliday}
              deleteHoliday={deleteHoliday}
            />
          </div>
          <div className="col">
            <AddPublicHoliday addHoliday={addHoliday} />
          </div>
        </div>
      </div>
    </div>
  );
};
