import React, { useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios';

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

interface ArchiveProps {
  id: string;
  archiveReason: string;
}

function Archive(props: ArchiveProps): JSX.Element {
  const [archiveUser, { loading, error, data }] = useMutation(ARCHIVE_USER, {
    variables: {
      id: props.id,
      archiveReason: props.archiveReason
    },
    refetchQueries: [{ query: ARCHIVED_USERS }]
  });

  if (loading) {
    return <p className="font-italic text-primary mr-3">Loading...</p>;
  }

  if (error) {
    return <p className="font-italic text-warning mr-3">Error...</p>;
  }

  if (data) {
    return (
      <p className="font-italic text-success mr-3">User has been archived!</p>
    );
  }

  return (
    <button onClick={() => archiveUser()} className="btn btn-primary mr-3">
      Confirm
    </button>
  );
}

interface ArchiveUserprops {
  staff_record: Array<{
    id: string;
    othernames: string;
    surname: string;
    email: string;
    annual: number;
    sick: number;
    bereavement: number;
    familyCare: number;
    christmas: number;
    dateOfBirth: string;
    employeeNumber: number;
    employeeStartDate: string;
    designation: string;
    gender: string;
  }>;
  id: string;
  archiveReason: string;
  handleArchiveReason: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCloseArchive: React.MouseEventHandler<HTMLButtonElement>;
}

function ArchiveUser(props: ArchiveUserprops): JSX.Element {
  return (
    <>
      {props.staff_record
        .filter(e => e.id === props.id)
        .map(record => (
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
                    <Archive
                      id={props.id}
                      archiveReason={props.archiveReason}
                    />
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

interface Props {
  staff_record: Array<{
    id: string;
    dbId: number;
    othernames: string;
    surname: string;
    email: string;
    annual: any;
    sick: any;
    bereavement: any;
    familyCare: any;
    christmas: any;
    dateOfBirth: string;
    maternity: any;
    paternity: any;
    employeeNumber: any;
    employeeStartDate: string;
    designation: string;
    gender: string;
  }>;
  refetch: Function;
}

interface ModifyUserDetailsProps {
  dbid: number | string;
  surname: string;
  othernames: string;
  staffEmail: string;
  designation: string;
  annualDays: number;
  sickDays: number;
  bereavmentDays: number;
  christmasDays: number;
  dateOfBirth: string;
  familyCare: number;
  maternityDays: number;
  paternityDays: number;
  gender: string;
  editReason: string;
  employeeNumber: number;
  employeeStartDate: string;
  adminUser: string | null;
}

export default function StaffRecordList(props: Props): JSX.Element {
  const [id, setID] = useState<string>('');
  const [dbid, setDBID] = useState<number | string | null>(null);
  const [dob, setDOB] = useState<Date | null>(null);
  const [employeeStartDate, setEmployeeStartDate] = useState<Date | null>(null);
  const [archiveReason, setArchiveReason] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isArchiving, setIsArchiving] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [serverMessage, setServerMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dbSurname = useRef<any>('');
  const dbOtherNames = useRef<any>('');
  const dbEmail = useRef<any>('');
  const dbDesignation = useRef<any>('');
  const dbAnnual = useRef<any>('');
  const dbSick = useRef<any>('');
  const dbChristmas = useRef<any>('');
  const dbGender = useRef<any>('');
  const dbFamilyCare = useRef<any>('');
  const dbMaternity = useRef<any>('');
  const dbBereavement = useRef<any>('');
  const dbEmployeeNumber = useRef<any>('');
  const dbDOB = useRef<any>(null);
  const dbEmployeeStartDate = useRef<any>(null);
  const dbPaternity = useRef<any>('');

  function handleSearchChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setSearchTerm(target.value);
  }

  function handleClearSearch(): void {
    setSearchTerm('');
  }

  function handleOpenEdit(e: React.MouseEvent<HTMLButtonElement>): void {
    setIsEditing(!isEditing);
    setID(e.currentTarget.id);
    setDBID(e.currentTarget.value);
  }

  function handleDateChange(e: React.SetStateAction<Date | null>): void {
    setDOB(e);
  }

  function handleEmployeeStartDateChange(
    e: React.SetStateAction<Date | null>
  ): void {
    setEmployeeStartDate(e);
  }

  function handleEditReason({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setEditReason(target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
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
      return;
    }

    setErrorMessage('');
    setServerMessage('');

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

    modifyUserRecord(modifyUserDetails);
  }

  function handleCloseEdit(): void {
    setIsEditing(!isEditing);
    setErrorMessage('');
    setServerMessage('');
    setDOB(null);
    setEmployeeStartDate(null);
    setID('');
    setDBID(null);

    if (editReason) {
      props.refetch();
    }
  }

  function handleOpenArchive(e: React.MouseEvent<HTMLButtonElement>): void {
    setIsArchiving(!isArchiving);
    setID(e.currentTarget.id);
  }

  function handleArchiveReason({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setArchiveReason(target.value);
  }

  function handleCloseArchive(): void {
    if (archiveReason) {
      props.refetch();
    }

    setIsArchiving(!isArchiving);
    setArchiveReason('');
    setID('');
  }

  async function modifyUserRecord(
    modifyUserDetails: ModifyUserDetailsProps
  ): Promise<any> {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/modifyuser', {
        user_id: modifyUserDetails.dbid,
        surname: modifyUserDetails.surname,
        othernames: modifyUserDetails.othernames,
        email: modifyUserDetails.staffEmail,
        designation: modifyUserDetails.designation,
        annual: modifyUserDetails.annualDays,
        sick: modifyUserDetails.sickDays,
        bereavement: modifyUserDetails.bereavmentDays,
        christmas: modifyUserDetails.christmasDays,
        date_of_birth: modifyUserDetails.dateOfBirth,
        family_care: modifyUserDetails.familyCare,
        maternity: modifyUserDetails.maternityDays,
        paternity: modifyUserDetails.paternityDays,
        gender: modifyUserDetails.gender,
        editReason: modifyUserDetails.editReason,
        employee_number: modifyUserDetails.employeeNumber,
        employee_start_date: modifyUserDetails.employeeStartDate,
        admin_user: modifyUserDetails.adminUser
      });

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data.message);
      } else {
        setServerMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  if (isEditing) {
    return (
      <>
        {props.staff_record
          .filter(e => e.id === id)
          .map(record => {
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
                      <form
                        encType="multipart/form-data"
                        onSubmit={handleSubmit}
                      >
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
                                dateFormat="dd/MM/YYYY"
                                openToDate={dob1}
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
                                dateFormat="dd/MM/YYYY"
                                openToDate={eSD}
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
                          <button
                            type="submit"
                            className="btn btn-primary mr-3"
                          >
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
                          {loading ? (
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            <p className="mt-3">{serverMessage}</p>
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
        staff_record={props.staff_record}
        id={id}
        handleArchiveReason={handleArchiveReason}
        archiveReason={archiveReason}
        handleCloseArchive={handleCloseArchive}
      />
    );
  }

  const filteredElements = props.staff_record
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
                Employee #
                <span className="text-primary font-weight-bold">
                  {record.employeeNumber}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Start Date
                <span className="text-primary font-weight-bold">
                  {employeeStartDate1}
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
                  onClick={handleOpenEdit}
                  id={record.id}
                  value={record.dbId}
                >
                  Edit
                </button>
                <button
                  className="btn btn-link"
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
      {props.staff_record.length > 0 ? (
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
