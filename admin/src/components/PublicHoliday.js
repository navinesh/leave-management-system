// @flow
import React, { Component, Fragment } from 'react';
import { gql } from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DayPickerSingleDateController } from 'react-dates';

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

const ADD_PUBLIC_HOLIDAY = gql`
  mutation addPublicholiday($holidayDate: String!) {
    addPublicholiday(holidayDate: $holidayDate) {
      publicHoliday {
        id
        holidayDate
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

type addHolidayProps = {
  holidayDate: any
};

const AddHoliday = (props: addHolidayProps) => (
  <Mutation
    mutation={ADD_PUBLIC_HOLIDAY}
    variables={{ holidayDate: props.holidayDate }}
    refetchQueries={[{ query: PUBLIC_HOLIDAY }]}
  >
    {(addPublicHoliday, { loading, error }) => {
      if (loading) {
        return <p className="font-italic text-primary mt-4">Loading...</p>;
      }

      if (error) {
        return <p className="font-italic text-warning mt-4">Error...</p>;
      }

      return (
        <button onClick={addPublicHoliday} className="btn btn-primary mt-4">
          Add
        </button>
      );
    }}
  </Mutation>
);

type addPublicHolidayProps = {
  render: any
};

type addPublicHolidayState = {
  date: any,
  focused: any,
  successMessage: string,
  errorMessage: string
};

class AddPublicHoliday extends Component<
  addPublicHolidayProps,
  addPublicHolidayState
> {
  onDateChange: Function;
  onFocusChange: Function;

  constructor() {
    super();
    this.state = {
      date: null,
      focused: false,
      successMessage: '',
      errorMessage: ''
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDateChange(e: Event) {
    this.setState({ date: e });
  }

  onFocusChange(e: Event & { focused: HTMLElement }) {
    this.setState({ focused: e.focused });
  }

  render() {
    return (
      <Fragment>
        <DayPickerSingleDateController
          onDateChange={this.onDateChange}
          onFocusChange={this.onFocusChange}
          focused={this.state.focused}
          date={this.state.date}
          hideKeyboardShortcutsPanel
        />
        {this.props.render(this.state.date)}
      </Fragment>
    );
  }
}

type deleteHolidayProps = {
  id: string
};

const DeleteHoliday = (props: deleteHolidayProps) => (
  <Mutation
    mutation={DELETE_PUBLIC_HOLIDAY}
    variables={{ id: props.id }}
    refetchQueries={[{ query: PUBLIC_HOLIDAY }]}
  >
    {(deletePublicHoliday, { loading, error }) => {
      if (loading) {
        return (
          <span className="ml-2 font-italic text-primary">Loading...</span>
        );
      }

      if (error) {
        console.log(error);
        return <span className="ml-2 font-italic text-warning">Error...</span>;
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
);

type PublicHolidayProps = {
  render: any
};

const PublicHolidays = (props: PublicHolidayProps) => (
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
            {props.render(item.id)}
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

export default () => (
  <div className="card">
    <div className="card-header">
      <h4>Public Holidays</h4>
    </div>
    <div className=" card-body">
      <div className="row">
        <div className="col">
          <PublicHolidays render={id => <DeleteHoliday id={id} />} />
        </div>
        <div className="col">
          <AddPublicHoliday
            render={date => <AddHoliday holidayDate={date} />}
          />
        </div>
      </div>
    </div>
  </div>
);
