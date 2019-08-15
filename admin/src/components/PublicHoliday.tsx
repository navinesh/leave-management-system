import React, { useState, ReactNode } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DayPickerSingleDateController } from 'react-dates';
import { Moment } from 'moment';

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
      ok
    }
  }
`;

interface AddHolidayProps {
  holidayDate: Moment;
}

function AddHoliday(props: AddHolidayProps): JSX.Element {
  const [addPublicHoliday, { loading, error }] = useMutation(
    ADD_PUBLIC_HOLIDAY,
    {
      variables: {
        holidayDate: props.holidayDate
      },
      refetchQueries: [{ query: PUBLIC_HOLIDAY }]
    }
  );

  if (loading) {
    return <p className="font-italic text-primary mt-4">Loading...</p>;
  }

  if (error) {
    console.log(error);
    return (
      <>
        <p className="font-italic text-danger mt-4">{error.message}</p>
        <button
          onClick={() => addPublicHoliday()}
          className="btn btn-primary mt-2"
        >
          Add
        </button>
      </>
    );
  }

  return (
    <button onClick={() => addPublicHoliday()} className="btn btn-primary mt-4">
      Add
    </button>
  );
}

type AddPublicHolidayProps = {
  render(props: Moment | null): ReactNode;
};

function AddPublicHoliday(props: AddPublicHolidayProps): JSX.Element {
  const [date, setDate] = useState<Moment | null>(null);
  const [focused, setFocused] = useState<boolean>(false);

  function onDateChange(date: Moment | null): void {
    setDate(date);
  }

  function onFocusChange(): void {
    setFocused(true);
  }

  return (
    <>
      <DayPickerSingleDateController
        onDateChange={onDateChange}
        onFocusChange={onFocusChange}
        focused={focused}
        date={date}
        hideKeyboardShortcutsPanel
      />
      {props.render(date)}
    </>
  );
}

interface deleteHolidayProps {
  id: string;
}

function DeleteHoliday(props: deleteHolidayProps): JSX.Element {
  const [deletePublicHoliday, { loading, error }] = useMutation(
    DELETE_PUBLIC_HOLIDAY,
    {
      variables: {
        id: props.id
      },
      refetchQueries: [{ query: PUBLIC_HOLIDAY }]
    }
  );

  if (loading) {
    return <span className="ml-2 font-italic text-primary">Loading...</span>;
  }

  if (error) {
    console.log(error);
    return <span className="ml-2 font-italic text-warning">Error...</span>;
  }

  return (
    <button
      className="btn btn-link btn-sm text-danger"
      onClick={() => deletePublicHoliday()}
    >
      Delete
    </button>
  );
}

type PublicHolidayProps = {
  render(props: string): ReactNode;
};

function PublicHolidays(props: PublicHolidayProps): JSX.Element {
  const { loading, error, data } = useQuery(PUBLIC_HOLIDAY);

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

  let list = data.publicHoliday.edges
    .map((a: { node: any }) => a.node)
    .sort(
      (b: { holidayDate: string | Date }, c: { holidayDate: string | Date }) =>
        +new Date(c.holidayDate) - +new Date(b.holidayDate)
    );

  const public_holidays = list.map(
    (item: { holidayDate: string | Date; id: string }) => {
      let hDate = new Date(item.holidayDate);
      let holiday_date = moment(hDate).format('dddd, Do MMMM YYYY');

      return (
        <li key={item.id}>
          {holiday_date}
          {props.render(item.id)}
        </li>
      );
    }
  );

  return (
    <div className="DeletePublicHolidays">
      <ul>{public_holidays}</ul>
    </div>
  );
}

export default function(): JSX.Element {
  return (
    <div className="card">
      <div className="card-header">
        <h4>Public Holidays</h4>
      </div>
      <div className=" card-body">
        <div className="row">
          <div className="col">
            <PublicHolidays
              render={function(id: string) {
                return <DeleteHoliday id={id} />;
              }}
            />
          </div>
          <div className="col">
            <AddPublicHoliday
              render={function(date: Moment) {
                return <AddHoliday holidayDate={date} />;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
