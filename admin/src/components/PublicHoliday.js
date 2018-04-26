// @flow
import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const moment = require('moment');

const PUBLIC_HOLIDAY = gql`
  {
    publicHoliday {
      edges {
        node {
          id
          holidayDate
        }
      }
    }
  }
`;

const DELETE_PUBLIC_HOLIDAY = gql`
  mutation deletePublicholiday($id: String!) {
    deletePublicholiday(id: $id) {
      publicHoliday {
        id
        holidayDate
      }
    }
  }
`;

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

const PublicHolidays = () => (
  <Query query={PUBLIC_HOLIDAY}>
    {({ loading, error, data: { publicHoliday } }) => {
      if (loading) {
        return (
          <div
            className="container text-center"
            style={{ paddingTop: '100px' }}
          >
            <div className="col-md-8 ml-auto mr-auto">
              <div className="loader1" />
            </div>
          </div>
        );
      }

      if (error) {
        console.log(error.message);
        return (
          <div
            className="container text-center"
            style={{ paddingTop: '100px' }}
          >
            <div className="col-md-8 ml-auto mr-auto">
              <p>Something went wrong!</p>
            </div>
          </div>
        );
      }

      let list = publicHoliday.edges.map(a => a.node).sort((b, c) => {
        return new Date(b.holidayDate) - new Date(c.holidayDate);
      });

      const public_holidays = list.map(item => {
        let hDate = new Date(item.holidayDate);
        let holiday_date = moment(hDate).format('dddd, Do MMMM YYYY');

        return (
          <li key={item.id}>
            {holiday_date}
            <Mutation
              mutation={DELETE_PUBLIC_HOLIDAY}
              variables={{ id: item.id }}
              refetchQueries={[{ query: PUBLIC_HOLIDAY }]}
            >
              {(deletePublicHoliday, { loading, error }) => {
                if (loading) {
                  return (
                    <span className="ml-2 font-italic text-primary">
                      Loading...
                    </span>
                  );
                }

                if (error) {
                  console.log(error);
                  return (
                    <span className="ml-2 font-italic text-warning">
                      Error...
                    </span>
                  );
                }

                return (
                  <button
                    className="btn btn-link btn-sm text-danger"
                    onClick={deletePublicHoliday}
                  >
                    Delete
                  </button>
                );
              }}
            </Mutation>
          </li>
        );
      });

      return (
        <div className="DeletePublicHolidays">
          <ul>{public_holidays}</ul>
        </div>
      );
    }}
  </Query>
);

type publicHolidayProps = {
  addHoliday: Function
};

export default (props: publicHolidayProps) => (
  <div className="card">
    <div className="card-header">
      <h4>Public Holidays</h4>
    </div>
    <div className=" card-body">
      <div className="row">
        <div className="col">
          <PublicHolidays />
        </div>
        <div className="col">
          <AddPublicHoliday addHoliday={props.addHoliday} />
        </div>
      </div>
    </div>
  </div>
);
