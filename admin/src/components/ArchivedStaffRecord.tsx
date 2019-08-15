import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const moment = require('moment');

const UNARCHIVE_USER = gql`
  mutation unArchiveUser($id: String!) {
    unArchiveUser(id: $id) {
      User {
        isArchived
      }
      ok
    }
  }
`;

const ACTIVE_USERS = gql`
  {
    findUsers(isArchived: "false") {
      id
      dbId
      othernames
      surname
      email
      annual
      sick
      christmas
      bereavement
      dateOfBirth
      maternity
      gender
    }
  }
`;

interface SearchProps {
  searchTerm: string;
  handleSearchChange: React.ChangeEventHandler<HTMLInputElement>;
}

function Search(props: SearchProps): JSX.Element {
  return (
    <div className="col-md-3">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={props.searchTerm}
          onChange={props.handleSearchChange}
        />
      </div>
    </div>
  );
}

type ClearSearchProps = {
  handleClearSearch: React.MouseEventHandler<HTMLButtonElement>;
};

function ClearSearch(props: ClearSearchProps): JSX.Element {
  return (
    <div className="col-md-3">
      <button className="btn btn-link" onClick={props.handleClearSearch}>
        Clear
      </button>
    </div>
  );
}

interface UnArchiveProps {
  id: string;
}

function UnArchive(props: UnArchiveProps): JSX.Element {
  const [unArchiveUser, { loading, error, data }] = useMutation(
    UNARCHIVE_USER,
    {
      variables: { id: props.id },
      refetchQueries: [{ query: ACTIVE_USERS }]
    }
  );
  if (loading) {
    return <p className="font-italic text-primary mr-3">Loading...</p>;
  }

  if (error) {
    return <p className="font-italic text-warning mr-3">Error...</p>;
  }

  if (data) {
    return (
      <p className="font-italic text-success mr-3">User has been unarchived!</p>
    );
  }

  return (
    <button onClick={() => unArchiveUser()} className="btn btn-primary mr-3">
      Yes
    </button>
  );
}

interface UnArchiveLeaveProps {
  archived_staff_record: Array<User>;
  id: string;
  handleCloseUnarchive: React.MouseEventHandler<HTMLButtonElement>;
}

interface User {
  id: string;
  othernames: string;
  surname: string;
}

function UnArchiveLeave(props: UnArchiveLeaveProps): JSX.Element {
  return (
    <div className="col-md-10 ml-auto mr-auto">
      {props.archived_staff_record
        .filter(e => e.id === props.id)
        .map(record => (
          <div key={record.id}>
            <div
              className="col-md-6 ml-auto mr-auto"
              style={{ paddingTop: '10px' }}
            >
              <div className="card">
                <h5 className="card-header">Unarchive</h5>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <p>
                        {record.othernames} {record.surname}
                      </p>
                    </div>
                  </div>
                  <div className="row justify-content-end">
                    <UnArchive id={props.id} />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={props.handleCloseUnarchive}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

interface Props {
  archived_staff_record: Array<UserRecord>;
  refetch: Function;
}

interface UserRecord extends User {
  dateOfBirth: string;
  annual: number;
  sick: number;
  bereavement: number;
  familyCare: number;
  christmas: number;
  maternity: number;
  paternity: number;
  gender: string;
}

export default function ArchivedStaffRecordList(props: Props): JSX.Element {
  const [id, setID] = useState<string>('');
  const [isUnarchive, setIsUnarchive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  function handleSearchChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setSearchTerm(target.value.toLowerCase());
  }

  function handleClearSearch(): void {
    setSearchTerm('');
  }

  function handleOpenUnarchive(e: React.MouseEvent<HTMLButtonElement>): void {
    setIsUnarchive(true);
    setID(e.currentTarget.id);
  }

  function handleCloseUnarchive(): void {
    setIsUnarchive(false);
    setID('');

    props.refetch();
  }

  const { archived_staff_record } = props;

  if (isUnarchive) {
    return (
      <UnArchiveLeave
        archived_staff_record={archived_staff_record}
        id={id}
        handleCloseUnarchive={handleCloseUnarchive}
      />
    );
  }

  const filteredElements = archived_staff_record
    .filter(
      e =>
        e.othernames.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.surname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return a.othernames.localeCompare(b.othernames);
    })
    .map(record => {
      let dob = new Date(record.dateOfBirth);
      let dateOfBirth = moment(dob).format('DD/MM/YYYY');

      return (
        <div className="col-md-3" key={record.id}>
          <div className="card mb-3 shadow p-3 mb-5 bg-white rounded">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <span className="h6">
                  {record.othernames} {record.surname}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Annual
                <span className="text-primary font-weight-bold">
                  {record.annual}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Sick
                <span className="text-primary font-weight-bold">
                  {record.sick}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Bereavement
                <span className="text-primary font-weight-bold">
                  {record.bereavement}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Family care
                <span className="text-primary font-weight-bold">
                  {record.familyCare}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Christmas
                <span className="text-primary font-weight-bold">
                  {record.christmas}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                DOB
                <span className="text-primary font-weight-bold">
                  {dateOfBirth}
                </span>
              </li>
              {record.gender.toLowerCase() === 'female' ? (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Maternity
                  <span className="text-primary font-weight-bold">
                    {record.maternity}
                  </span>
                </li>
              ) : (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Paternity
                  <span className="text-primary font-weight-bold">
                    {record.paternity}
                  </span>
                </li>
              )}
              <li className="list-group-item">
                <button
                  className="btn btn-link pl-0"
                  onClick={handleOpenUnarchive}
                  id={record.id}
                >
                  Unarchive
                </button>
              </li>
            </ul>
          </div>
        </div>
      );
    });

  return (
    <>
      {archived_staff_record.length > 0 ? (
        <div>
          <div className="row">
            <Search
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
            />
            {searchTerm && (
              <ClearSearch handleClearSearch={handleClearSearch} />
            )}
          </div>
          <div className="row">{filteredElements}</div>
        </div>
      ) : (
        <div
          className="card card-body border-0"
          style={{ paddingTop: '100px', paddingBottom: '260px' }}
        >
          <h1 className="display-4 text-center">
            <em>There is no record to display.</em>
          </h1>
        </div>
      )}
    </>
  );
}
