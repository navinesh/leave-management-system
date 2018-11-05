// @flow
import React, { useState, useRef } from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const moment = require('moment');

const ARCHIVE_USER = gql`
  mutation archiveUser($id: String!, $archiveReason: String!) {
    archiveUser(id: $id, archiveReason: $archiveReason) {
      User {
        isArchived
      }
      ok
    }
  }
`;

const ARCHIVED_USERS = gql`
  {
    findUsers(isArchived: "true") {
      id
      dbId
      othernames
      surname
      email
      annual
      sick
      bereavement
      familyCare
      christmas
      dateOfBirth
      maternity
      paternity
      gender
    }
  }
`;

function Search(props) {
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

function ClearSearch(props) {
  return (
    <div className="col-md-3">
      <button className="btn btn-link" onClick={props.handleClearSearch}>
        Clear
      </button>
    </div>
  );
}

function Archive(props) {
  return (
    <Mutation
      mutation={ARCHIVE_USER}
      variables={{
        id: props.id,
        archiveReason: props.archiveReason
      }}
      refetchQueries={[{ query: ARCHIVED_USERS }]}
    >
      {(archiveUser, { loading, error, data }) => {
        if (loading) {
          return <p className="font-italic text-primary mr-3">Loading...</p>;
        }

        if (error) {
          return <p className="font-italic text-warning mr-3">Error...</p>;
        }

        if (data) {
          return (
            <p className="font-italic text-success mr-3">
              User has been archived!
            </p>
          );
        }

        return (
          <button onClick={archiveUser} className="btn btn-primary mr-3">
            Confirm
          </button>
        );
      }}
    </Mutation>
  );
}

function ArchiveUser(props) {
  return (
    <>
      {props.staff_record.filter(e => e.id === props.id).map(record => (
        <div key={record.id}>
          <div
            className="col-md-6 ml-auto mr-auto"
            style={{ paddingTop: '10px' }}
          >
            <div className="card">
              <h5 className="card-header">Archive</h5>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <p>
                      {record.othernames} {record.surname}
                    </p>
                    <div className="form-group">
                      <label htmlFor="reason">Reason</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter reason"
                        id="reason"
                        onChange={props.handleArchiveReason}
                      />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <Archive id={props.id} archiveReason={props.archiveReason} />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={props.handleCloseArchive}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

type Props = {
  staff_record: Object,
  dispatch: Function,
  onModifyUserRecordSubmit: Function,
  message: string,
  isFetching: boolean,
  refetch: Function
};

// type State = {
//   errorMessage: string,
//   id: string,
//   dbid: string,
//   dob: any,
//   employeeStartDate: any,
//   archiveReason: any,
//   isEditing: boolean,
//   isArchiving: boolean,
//   editReason: string,
//   searchTerm: string
// };

export default function StaffRecordList(props: Props) {
  const [id, setID] = useState('');
  const [dbid, setDBID] = useState('');
  const [dob, setDOB] = useState(null);
  const [employeeStartDate, setEmployeeStartDate] = useState(null);
  const [archiveReason, setArchiveReason] = useState(null);
  const [editReason, setEditReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dbSurname = useRef('');
  const dbOtherNames = useRef('');
  const dbEmail = useRef('');
  const dbDesignation = useRef('');
  const dbAnnual = useRef('');
  const dbSick = useRef('');
  const dbChristmas = useRef('');
  const dbGender = useRef('');
  const dbFamilyCare = useRef('');
  const dbMaternity = useRef('');
  const dbBereavement = useRef('');
  const dbEmployeeNumber = useRef('');
  const dbDOB = useRef(null);
  const dbEmployeeStartDate = useRef(null);
  const dbPaternity = useRef('');

  function handleSearchChange({ target }: SyntheticInputEvent<>) {
    setSearchTerm(target.value);
  }

  function handleClearSearch() {
    setSearchTerm('');
  }

  function handleOpenEdit({ target }: SyntheticInputEvent<>) {
    setIsEditing(!isEditing);
    setID(target.id);
    setDBID(target.value);
  }

  function handleDateChange(e: Event) {
    setDOB(e);
  }

  function handleEmployeeStartDateChange(e: Event) {
    setEmployeeStartDate(e);
  }

  function handleEditReason({ target }: SyntheticInputEvent<>) {
    setEditReason(target.value);
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    const surname = dbSurname.current.value;
    const othernames = dbOtherNames.current.value;
    const staffEmail = dbEmail.current.value;
    const designation = dbDesignation.current.value;
    const annualDays = dbAnnual.current.value;
    const sickDays = dbSick.current.value;
    const bereavmentDays = dbBereavement.current.value;
    const christmasDays = dbChristmas.current.value;
    const gender = dbGender.current.value;
    const familyCare = dbFamilyCare.current.value;
    const employeeNumber = dbEmployeeNumber.current.value;

    let dobDate = new Date(dbDOB.current.value);
    let userDob = moment(dobDate).format('DD/MM/YYYY');

    const dateOfBirth = dob ? moment(dob).format('DD/MM/YYYY') : userDob;

    let eStartDate = new Date(dbEmployeeStartDate.current.value);
    let employeeSD = moment(eStartDate).format('DD/MM/YYYY');

    const userEmployeeStartDate = employeeStartDate
      ? moment(employeeStartDate).format('DD/MM/YYYY')
      : employeeSD;

    const maternityDays =
      gender.toLowerCase() === 'female' && dbMaternity.current.value
        ? dbMaternity.current.value
        : 0;

    const paternityDays =
      gender.toLowerCase() === 'male' && dbPaternity.current.value
        ? dbPaternity.current.value
        : 0;

    const adminUser = localStorage.getItem('admin_user');

    // verify data
    if (
      !dbid ||
      !surname ||
      !othernames ||
      !staffEmail ||
      !designation ||
      !annualDays ||
      !sickDays ||
      !bereavmentDays ||
      !christmasDays ||
      !dateOfBirth ||
      !familyCare ||
      !gender ||
      !editReason
    ) {
      setErrorMessage('One or more required fields are missing!');
      return null;
    }

    // prepare data to post to database
    const modifyUserDetails = {
      dbid: dbid,
      surname: surname,
      othernames: othernames,
      staffEmail: staffEmail,
      designation: designation,
      annualDays: annualDays,
      sickDays: sickDays,
      bereavmentDays: bereavmentDays,
      christmasDays: christmasDays,
      dateOfBirth: dateOfBirth,
      familyCare: familyCare,
      maternityDays: maternityDays,
      paternityDays: paternityDays,
      gender: gender,
      editReason: editReason,
      employeeNumber: employeeNumber,
      employeeStartDate: userEmployeeStartDate,
      adminUser: adminUser
    };

    props.onModifyUserRecordSubmit(modifyUserDetails);
  }

  function handleCloseEdit() {
    const { dispatch, refetch } = props;

    setIsEditing(!isEditing);
    setErrorMessage('');
    setDOB(null);
    setEmployeeStartDate(null);
    setID('');
    setDBID('');

    if (editReason) {
      dispatch({ type: 'CLEAR_MODIFY_USER_MESSAGE' });
      refetch();
    }
  }

  function handleOpenArchive(e: SyntheticEvent<HTMLElement>) {
    setIsArchiving(!isArchiving);
    setID(e.currentTarget.id);
  }

  function handleArchiveReason({ target }: SyntheticInputEvent<>) {
    setArchiveReason(target.value);
  }

  function handleCloseArchive() {
    if (archiveReason) {
      props.refetch();
    }

    setIsArchiving(!isArchiving);
    setArchiveReason(null);
    setID('');
  }

  const { staff_record, isFetching, message } = props;

  if (isEditing) {
    return (
      <>
        {staff_record.filter(e => e.id === id).map(record => {
          let dob1 = new Date(record.dateOfBirth);
          let dateOfBirth = moment(dob1).format('DD/MM/YYYY');

          let eSD = new Date(record.employeeStartDate);
          let employeeStartDate1 = moment(eSD).format('DD/MM/YYYY');

          return (
            <div key={record.id}>
              <div className="col-md-6 ml-auto mr-auto pb-2">
                <div className="card">
                  <h5 className="card-header">Edit</h5>
                  <div className="card-body">
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="surName">Surname</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={record.surname}
                              ref={dbSurname}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="otherNames">Other Names</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={record.othernames}
                              ref={dbOtherNames}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="staffEmail">Email address</label>
                        <input
                          type="email"
                          className="form-control"
                          defaultValue={record.email}
                          ref={dbEmail}
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="designation">Designation</label>
                            <select
                              className="form-control"
                              id="designation"
                              defaultValue={record.designation}
                              ref={dbDesignation}
                            >
                              <option>{record.designation}</option>
                              <option>Admin</option>
                              <option>Level 3 Lawyer</option>
                              <option>Level 4 Lawyer</option>
                              <option>Level 3 Secretary</option>
                              <option>Level 4 Secretary</option>
                              <option>TM</option>
                              <option>Accounts</option>
                              <option>Library</option>
                              <option>IT</option>
                              <option>Search Clerk Level 3</option>
                              <option>Search Clerk Level 4</option>
                              <option>Legal Executive</option>
                              <option>Partner</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select
                              className="form-control"
                              id="designation"
                              defaultValue={record.gender}
                              ref={dbGender}
                            >
                              <option>{record.gender}</option>
                              <option>Male</option>
                              <option>Female</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="annualLeave">Annual leave</label>
                            <input
                              className="form-control"
                              defaultValue={record.annual}
                              ref={dbAnnual}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="sickLeave">Sick leave</label>
                            <input
                              className="form-control"
                              defaultValue={record.sick}
                              ref={dbSick}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="bereavementLeave">
                              Bereavement leave
                            </label>
                            <input
                              className="form-control"
                              defaultValue={record.bereavement}
                              ref={dbBereavement}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="familyCareLeave">
                              Family care leave
                            </label>
                            <input
                              className="form-control"
                              defaultValue={record.familyCare}
                              ref={dbFamilyCare}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="christmasLeave">
                              Christmas leave
                            </label>
                            <input
                              className="form-control"
                              defaultValue={record.christmas}
                              ref={dbChristmas}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="dob">Date of birth</label>
                            <input
                              type="hidden"
                              defaultValue={record.dateOfBirth}
                              ref={dbDOB}
                            />
                            <DatePicker
                              className="form-control"
                              dateFormat="DD/MM/YYYY"
                              openToDate={moment(dob1)}
                              selected={dob}
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              onChange={handleDateChange}
                              placeholderText={dateOfBirth}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="employeeNumber">
                              Employee number
                            </label>
                            <input
                              className="form-control"
                              defaultValue={record.employeeNumber}
                              ref={dbEmployeeNumber}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="employeeStartDate">
                              Employee start date
                            </label>
                            <input
                              type="hidden"
                              defaultValue={record.employeeStartDate}
                              ref={dbEmployeeStartDate}
                            />
                            <DatePicker
                              className="form-control"
                              dateFormat="DD/MM/YYYY"
                              openToDate={moment(eSD)}
                              selected={employeeStartDate}
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              onChange={handleEmployeeStartDateChange}
                              placeholderText={employeeStartDate1}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {record.gender.toLowerCase() === 'female' && (
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="Maternity leave">
                                Maternity leave
                              </label>
                              <input
                                className="form-control"
                                defaultValue={record.maternity}
                                ref={dbMaternity}
                              />
                            </div>
                          </div>
                        )}
                        {record.gender.toLowerCase() === 'male' && (
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="Paternity leave">
                                Paternity leave
                              </label>
                              <input
                                className="form-control"
                                defaultValue={record.paternity}
                                ref={dbPaternity}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="reason">Reason</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter reason"
                              id="reason"
                              onChange={handleEditReason}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-end">
                        <button type="submit" className="btn btn-primary mr-3">
                          Save changes
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={handleCloseEdit}
                        >
                          Close
                        </button>
                      </div>
                      <div className="text-primary text-center">
                        {isFetching ? (
                          <div className="loader2" />
                        ) : (
                          <p className="mt-3">{message}</p>
                        )}
                      </div>
                      <div className="text-danger text-center">
                        {errorMessage}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  if (isArchiving) {
    return (
      <ArchiveUser
        staff_record={staff_record}
        id={id}
        handleArchiveReason={handleArchiveReason}
        archiveReason={archiveReason}
        handleCloseArchive={handleCloseArchive}
      />
    );
  }

  const filteredElements = staff_record
    .filter(
      e =>
        e.othernames.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.surname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return a.othernames.localeCompare(b.othernames);
    })
    .map(record => {
      let dob1 = new Date(record.dateOfBirth);
      let dateOfBirth = moment(dob1).format('DD/MM/YYYY');

      let eStarteDate = new Date(record.employeeStartDate);
      let employeeStartDate1 = moment(eStarteDate).format('DD/MM/YYYY');

      return (
        <div className="col-md-3" key={record.id}>
          <div className="card mb-3 shadow p-3 mb-5 bg-white rounded">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <p className="h5">
                  {record.othernames} {record.surname}
                </p>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Annual
                <span className="badge badge-primary badge-pill">
                  {record.annual}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Sick
                <span className="badge badge-primary badge-pill">
                  {record.sick}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Bereavement
                <span className="badge badge-primary badge-pill">
                  {record.bereavement}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Family care
                <span className="badge badge-primary badge-pill">
                  {record.familyCare}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Christmas
                <span className="badge badge-primary badge-pill">
                  {record.christmas}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Employee #
                <span className="badge badge-primary badge-pill">
                  {record.employeeNumber}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Start Date
                <span className="badge badge-primary badge-pill">
                  {employeeStartDate1}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                DOB
                <span className="badge badge-primary badge-pill">
                  {dateOfBirth}
                </span>
              </li>
              {record.gender.toLowerCase() === 'female' ? (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Maternity
                  <span className="badge badge-primary badge-pill">
                    {record.maternity}
                  </span>
                </li>
              ) : (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Paternity
                  <span className="badge badge-primary badge-pill">
                    {record.paternity}
                  </span>
                </li>
              )}
              <li className="list-group-item">
                <button
                  className="btn btn-link text-primary pl-0"
                  onClick={handleOpenEdit}
                  id={record.id}
                  value={record.dbId}
                >
                  Edit
                </button>
                <button
                  className="btn btn-link text-primary"
                  onClick={handleOpenArchive}
                  id={record.id}
                >
                  Archive
                </button>
              </li>
            </ul>
          </div>
        </div>
      );
    });

  return (
    <>
      {staff_record.length > 0 ? (
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
