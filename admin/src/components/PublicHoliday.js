// @flow
import React, { Component } from 'react';

const moment = require('moment');

import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import '../spinners.css';

const PublicHolidays = (props: {
  public_holiday: Array<any>,
  dispatch: Function,
  onAddPublicHolidaySubmit: Function,
  onDeletePublicHolidaySubmit: Function,
  isAddPublicFetching: boolean,
  addPublicMessage: string,
  isDeletePublicFetching: boolean,
  deletePublicMessage: string
}) => (
  <div className="col-md-10 offset-md-1 card card-block">
    <div className="row">
      <div className="col">
        <h4>Public Holidays</h4>
      </div>
    </div>
    <div className="row">
      <div className="col">
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
            ? <div className="text-success">
                ADDING...
              </div>
            : <p className="text-primary">
                {props.addPublicMessage}
              </p>}
          {props.isDeletePublicFetching
            ? <div className="text-danger">
                DELETING...
              </div>
            : <p className="text-primary">
                {props.deletePublicMessage}
              </p>}
        </div>
      </div>
    </div>
  </div>
);

class AddPublicHoliday extends Component {
  state: { date: any, errorMessage: string, focused: boolean };

  handleSubmit: Function;
  onDateChange: Function;
  onFocusChange: Function;

  constructor() {
    super();
    this.state = { date: null, errorMessage: '', focused: false };

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

    const publicHolidayDate = {
      holidayDate: holidayDate
    };

    this.props.onAddPublicHolidaySubmit(publicHolidayDate);
    this.setState({ date: null, holidayDate: '', errorMessage: '' });

    setTimeout(() => {
      this.props.dispatch({ type: 'CLEAR_ADD_PUBLIC_MESSAGE' });
    }, 3000);
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
              withPortal
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
    this.state = { errorMessage: '' };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(e: Event & { currentTarget: HTMLElement }) {
    e.preventDefault();
    const id = e.currentTarget.id ? e.currentTarget.id : null;

    if (!id) {
      this.setState({
        errorMessage: 'Valid ID is required!'
      });

      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 3000);
      return null;
    }

    const deletePublicHolidayDate = {
      id: id
    };

    this.props.onDeletePublicHolidaySubmit(deletePublicHolidayDate);
    this.setState({ id: '', errorMessage: '' });

    setTimeout(() => {
      this.props.dispatch({ type: 'CLEAR_DELETE_PUBLIC_MESSAGE' });
    }, 3000);
  }

  render() {
    let list = this.props.public_holiday.sort((a, b) => {
      return new Date(a.holiday_date) - new Date(b.holiday_date);
    });

    const public_holidays = list.map(item => {
      let hDate = new Date(item.holiday_date);
      let holiday_date = moment(hDate).format('dddd, Do MMMM YYYY');
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
          {this.state.errorMessage ? <div>{this.state.errorMessage}</div> : ''}
        </div>
      </div>
    );
  }
}

export default PublicHolidays;
